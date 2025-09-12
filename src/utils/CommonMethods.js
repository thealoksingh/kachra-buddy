import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Key from '../constants/key';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const hasPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      
      if (hasPermission) {
        console.log('[perm] already granted');
        return true;
      }
      
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'App needs access to your location to show nearby services',
          buttonPositive: 'Allow',
          buttonNegative: 'Deny',
        },
      );
      console.log('[perm] granted:', granted);
      
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('[perm] error:', err);
      return false;
    }
  }
  return true;
};

export const fetchAddressFromCoordinates = async (lat, lng) => {
  const mapkey = Key?.mapApiKey;
  console.log('[geo] reverse geocode for:', lat, lng);
  
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${mapkey}`,
    );
    const data = await res.json();
    console.log('[geo] reverse geocode response:', data?.status);
    
    if (data?.results?.length > 0) {
      return data.results[0].formatted_address;
    } else {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  } catch (error) {
    console.log('[geo] reverse geocode error:', error);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

export const formatAddress = (fullAddress) => {
  if (!fullAddress) return 'Unknown location';
  
  const parts = fullAddress.split(',').map(part => part.trim());
  
  let city = '';
  let state = '';
  let country = '';
  let pincode = '';
  
  // Extract pincode (6 digits for India)
  const pincodeMatch = fullAddress.match(/\b\d{6}\b/);
  if (pincodeMatch) {
    pincode = pincodeMatch[0];
  }
  
  // Country is usually the last part
  if (parts.length > 0) {
    country = parts[parts.length - 1];
  }
  
  // State is usually second last (before country)
  if (parts.length > 1) {
    const statePart = parts[parts.length - 2];
    // Remove pincode from state if present
    state = statePart.replace(/\b\d{6}\b/, '').trim();
  }
  
  // City is usually third last or look for known city patterns
  if (parts.length > 2) {
    city = parts[parts.length - 3].replace(/\b\d{6}\b/, '').trim();
  }
  
  // Build formatted address
  const addressParts = [city, state, country, pincode].filter(part => part && part.length > 0);
  
  return addressParts.length > 0 ? addressParts.join(', ') : 'Unknown location';
};


export const getUserLocation = async (onSuccess, onError) => {
  console.log('[loc] fetching user location...');
  const hasPermission = await requestLocationPermission();
  
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Cannot access location');
    return;
  }

 Geolocation.getCurrentPosition(
    async (position) => {
      console.log('[loc] position:', position);
      const { latitude, longitude } = position.coords;
      
      // Fetch address for the coordinates
      const fullAddress = await fetchAddressFromCoordinates(latitude, longitude);
      const formattedAddress = formatAddress(fullAddress);
      
      if (onSuccess) {
        onSuccess({ latitude, longitude, address: formattedAddress, fullAddress });
      }
    },
    (error) => {
      console.log('[loc] error code:', error.code);
      console.log('[loc] error message:', error.message);
      
      if (error.code === 1) {
        Alert.alert(
          'Permission Required',
          'Location permission is needed. Please go to Settings > Apps > Your App > Permissions and enable Location.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      } else if (error.code === 2) {
        Alert.alert(
          'Enable GPS', 
          'GPS is turned off. Please enable Location/GPS in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
      } else if (error.code === 3) {
        Alert.alert('Timeout', 'Location request timed out. Please try again.');
      } else {
        Alert.alert('Location Error', 'Could not get current location');
      }
      
      if (onError) {
        onError(error);
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
    }
  );
};

export const callUser = (phoneNumber) => {
  if (!phoneNumber) {
    Alert.alert("Invalid", "Phone number not available");
    return;
  }
  const url = `tel:${phoneNumber}`;
  Linking.openURL(url).catch(() =>
    Alert.alert("Error", "Unable to make a call")
  );
};

// 🗺️ Open Google Maps with directions


export  const openGoogleMaps = (latitude, longitude, label = 'Seller Location') => {
  const encodedLabel = encodeURIComponent(label);
  const url = Platform.select({
    ios: `maps://?q=${encodedLabel}&ll=${latitude},${longitude}`,
    android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`,
  });
  Linking.openURL(url);
};

 export const getStatusColor = status => {
    switch (status?.toUpperCase()) {
      case 'INCOMPLETE': return '#ff9800';
      case 'COMPLETED': return '#4caf50';
      case 'ACTIVE': return '#2196f3';
      case 'CANCELLED_BY_ADMIN': return '#f44336';
      case 'CANCELLED_BY_DRIVER': return '#f44336';
      case 'CANCELLED_BY_USER': return '#f44336';
      case 'OUT_FOR_PICKUP': return '#3ac8c8ff';
      default: return '#757575';
    }
};
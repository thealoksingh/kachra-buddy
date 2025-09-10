import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/selector';
import { updateAdminProfile, updateAdminProfilePic } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../styles/commonStyles';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import Key from '../../constants/key';

const EditAdminProfile = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;
  
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [contactNumber, setContactNumber] = useState(user?.contactNumber || '');
  const [loading, setLoading] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  const { openCamera, openGallery } = useImagePicker();
  
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await dispatch(updateAdminProfile({
        fullName,
        contactNumber
      }));
      
      if (updateAdminProfile.fulfilled.match(result)) {
        dispatch(showSnackbar({ 
          message: 'Profile updated successfully', 
          type: 'success', 
          time: Date.now() 
        }));
        navigation.goBack();
      } else {
        dispatch(showSnackbar({ 
          message: 'Failed to update profile', 
          type: 'error', 
          time: Date.now() 
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({ 
        message: 'Failed to update profile', 
        type: 'error', 
        time: Date.now() 
      }));
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProfilePic = async (imageData) => {
    try {
      const result = await dispatch(updateAdminProfilePic(imageData.uri));
      
      if (updateAdminProfilePic.fulfilled.match(result)) {
        dispatch(showSnackbar({ 
          message: 'Profile picture updated successfully', 
          type: 'success', 
          time: Date.now() 
        }));
        setProfileImage(null);
      } else {
        dispatch(showSnackbar({ 
          message: 'Failed to update profile picture', 
          type: 'error', 
          time: Date.now() 
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({ 
        message: 'Failed to update profile picture', 
        type: 'error', 
        time: Date.now() 
      }));
    }
  };
  
  const pickImage = async (source) => {
    try {
      let result = null;
      if (source === 'camera') {
        result = await openCamera();
      } else {
        result = await openGallery();
      }
      
      if (result?.uri) {
        await handleUpdateProfilePic(result);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };
  
  const currentAvatar = profileImage || (user?.avatarUrl ? API_BASE_URL + user.avatarUrl : null);
  
  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Edit Profile" />
      
      <ScrollView style={styles.container}>
        <View style={styles.profileSection}>
          <TouchableOpacity 
            onPress={() => setPickerSheetVisible(true)}
            style={styles.imageContainer}
          >
            {currentAvatar ? (
              <Image 
                source={{ 
                  uri: currentAvatar,
                  headers: user?.avatarUrl && !profileImage ? {
                    Authorization: `Bearer ${user?.accessToken}`,
                  } : undefined,
                }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.formSection}>
          <InputBox
            label="Full Name"
            value={fullName}
            setter={setFullName}
            placeholder="Enter your full name"
          />
          
          <InputBox
            label="Contact Number"
            value={contactNumber}
            setter={setContactNumber}
            placeholder="Enter your contact number"
            type="phone-pad"
          />
        </View>
        
        <View style={styles.buttonSection}>
          <ButtonWithLoader
            name="Update Profile"
            loadingName="Updating..."
            isLoading={loading}
            method={handleUpdateProfile}
          />
        </View>
      </ScrollView>
      
      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
    </View>
  );
};

export default EditAdminProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: Colors.grayColor,
    fontSize: 14,
  },
  formSection: {
    marginBottom: 30,
  },
  buttonSection: {
    marginTop: 20,
  },
});
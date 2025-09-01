import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const vehicleType = [
  {
    name: 'Two Wheeler',
    image: require('../../../assets/images/bike.png'),
  },
  {
    name: 'Three Wheeler',
    image: require('../../../assets/images/rikshaw.png'),
  },
  {
    name: 'Car',
    image: require('../../../assets/images/car.png'),
  },
  {
    name: 'Mini Cargo',
    image: require('../../../assets/images/miniCargo.png'),
  },
  {
    name: 'Truck',
    image: require('../../../assets/images/truck.png'),
  },
  {
    name: 'Bus',
    image: require('../../../assets/images/bus.png'),
  },
];

const ScrapVehicleScreen = () => {
  const navigation = useNavigation();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);

  const renderVehicleCard = ({ item, index }) => {
    const isSelected = selectedVehicle === index;
    return (
      <TouchableOpacity
        style={[styles.vehicleCard, isSelected && styles.selectedVehicleCard]}
        onPress={() => setSelectedVehicle(index)}
        activeOpacity={0.8}
      >
        <Image
          source={item.image}
          style={{
            width: 60,
            height: 60,
            resizeMode: 'contain',
            marginBottom: 8,
          }}
        />
        <Text
          style={[
            styles.vehicleName,
            isSelected && { color: Colors.secondary },
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Scrap Your Old Vehicles" />

      <View style={styles.scrapVehicleCard}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Sell Old Vehicle</Text>
          <Text style={styles.subtitle}>
            Turn your old stuff into cash today.
          </Text>
        </View>

        <View style={styles.videoContainer}>
          {videoLoading && (
            <View style={styles.loaderWrapper}>
              <Image
                source={require('../../../assets/images/scrapVehicle.png')}
                style={styles.fallbackImage}
              />
              <ActivityIndicator
                size="large"
                color="#00BFA5"
                style={styles.loader}
              />
            </View>
          )}
          <Video
            source={{
              uri: 'https://drive.google.com/uc?export=download&id=1CtKlYq9x-herZIy0x9j1Z7tviAq40fS3',
            }}
            style={styles.video}
            resizeMode="cover"
            repeat
            muted
            onLoadStart={() => setVideoLoading(true)}
            onLoad={() => setVideoLoading(false)}
            onBuffer={({ isBuffering }) => setVideoLoading(isBuffering)}
            onError={e => {
              console.log('Video error', e);
              setVideoLoading(false);
            }}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Select Vehicle Type <Text style={{ color: Colors.secondary }}>*</Text>
      </Text>
      <View style={{ height: 130 }}>
        <FlatList
          data={vehicleType}
          renderItem={renderVehicleCard}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        />
      </View>

      <View style={styles.formCard}>
        <InputBox
          value={vehicleNumber}
          setter={setVehicleNumber}
          placeholder={'Enter Vehicle Number'}
          label={'Vehicle Number'}
          optional={false}
          type={'default'}
        />
        <InputBox
          value={vehicleBrand}
          setter={setVehicleBrand}
          placeholder={'Enter Vehicle Brand'}
          label={'Vehicle Brand'}
          optional={false}
          type={'default'}
        />
        <InputBox
          value={vehicleModel}
          setter={setVehicleModel}
          placeholder={'Enter Vehicle Model'}
          label={'Vehicle Model'}
          optional={false}
          type={'default'}
        />
      </View>

      <View style={styles.bottomButton}>
        <ButtonWithLoader
          name="Continue"
          loadingName="Processing..."
          isLoading={loading}
          method={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('checkoutScreen');
            }, 1000);
          }}
        />
      </View>
    </View>
  );
};

export default ScrapVehicleScreen;

const styles = StyleSheet.create({
  scrapVehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: Colors.blackColor,
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
  },
  videoContainer: {
    width: 150,
    height: 150,
    marginLeft: 10,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loaderWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
  },
  fallbackImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  loader: {
    position: 'absolute',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    color: Colors.primary,
  },
  vehicleCard: {
    width: 110,
    height: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedVehicleCard: {
    backgroundColor: Colors.lightGreenColor + '30',
    borderColor: Colors.secondary,
    shadowOpacity: 0.15,
    elevation: 5,
  },
  vehicleName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  formCard: {
    margin: 12,
    padding: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  bottomButton: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    marginTop: 'auto',
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {
  appFonts,
  Colors,
  screenWidth,
  textStyles,
} from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import {
  DottedBlackLoader,
  DottedWhiteLoader,
} from '../../components/lottie/loaderView';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MovingIcons from '../../components/userComponents/MovingIcons';
import AdSlider from '../../components/userComponents/AdSlider';
import MiniProductScrollSection from '../../components/userComponents/MiniProductScrollSection';
import { useNavigation } from '@react-navigation/native';
import { products, addsData } from '../../utils/dummyData';
import { FaddedIcon } from '../../components/commonComponents';
import CurvedCard from '../../screens/driver/CurvedCard';

export const icons = [
  { id: '1', path: require('../../../assets/icons/shoes.png'), label: 'Shoe' },
  {
    id: '2',
    path: require('../../../assets/icons/plastic.png'),
    label: 'Plastic',
  },
  {
    id: '3',
    path: require('../../../assets/icons/metal.png'),
    label: 'Metal',
  },
  { id: '4', path: require('../../../assets/icons/books.png'), label: 'Paper' },
  {
    id: '5',
    path: require('../../../assets/icons/electronic.png'),
    label: 'Electronics',
  },
  {
    id: '6',
    path: require('../../../assets/icons/tank.png'),
    label: 'Water Tank',
  },
  { id: '7', path: require('../../../assets/icons/tyre.png'), label: 'Tyre' },
  {
    id: '8',
    path: require('../../../assets/icons/battery.png'),
    label: 'Battery',
  },
  {
    id: '9',
    path: require('../../../assets/icons/recycle.png'),
    label: 'Garbage',
  },
  { id: '10', path: require('../../../assets/icons/box.png'), label: 'Carton' },
];

export default function DriverHome() {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.whiteColor]}
      style={{ flex: 1 }}
    >
      <MyStatusBar />
      <View style={styles.topBar}>
        <TouchableOpacity
        activeOpacity={0.8}
        onPress={()=>navigation.navigate('driverProfileScreen')}
        style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop',
            }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.userName}>Alok Singh</Text>
            <Text
              style={{ ...textStyles.extraSmall, color: Colors.whiteColor }}
            >
              Sinhgad College of Engineering
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('notificationScreen')}
          style={{ position: 'relative' }}
        >
          <Ionicons
            name="notifications-outline"
            size={28}
            color={Colors.whiteColor}
          />

          <View style={styles.badge}>
            <Text
              style={{ ...textStyles.extraSmall, color: Colors.whiteColor }}
            >
              0
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainSection}>
        <MovingIcons icons={icons} />
        <AdSlider data={addsData} height={180} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 20,
            marginHorizontal: 'auto',
            gap: 8,
          }}
        >
        
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('pickupRequests')}
          >
            <CurvedCard
              icon="cube-outline"
              title="Pickup"
              bottomTitle="Pickup Request"
              description="View and manage your pickup orders"
               firstColor={Colors.primary}
              secondColor="#3dec48ff"
            />
          </TouchableOpacity>
          <TouchableOpacity
           activeOpacity={0.8}
          onPress={() => navigation.navigate('helpScreen')}>
            <CurvedCard
              icon="help-circle-outline"
              title="Contact Us"
              bottomTitle="Support Center"
              description="Get help for any queries you may have"
              firstColor={Colors.secondary}
              secondColor="#f9a136ff"     
            />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 20 }}>
          <AdSlider data={addsData} height={90} />
        </View>

        <FaddedIcon />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  userName: {
    fontSize: 14,
    fontFamily: appFonts.semiBold,
    color: Colors.whiteColor,
  },
  searchBar: {
    marginTop: 15,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
  },
  searchText: {
    marginLeft: 8,
    color: '#999',
    fontSize: 14,
  },
  mainSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 18,
  },

  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: Colors.redColor,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrapVehicleCard: {
    width: screenWidth - 60,
    height: 180,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  sellnowButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
});

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import {
  appFonts,
  Colors,
  screenWidth,
  textStyles,
} from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import Graph from './Graph';
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

// Admin dashboard cards configuration
const adminCards = [
  
  {
    id: 1,
    icon: 'storefront-outline',
    title: 'Product Catalog',
    bottomTitle: 'Manage Products',
    description: 'Add or update in product listings',
    firstColor: '#f093fb',
    secondColor: '#f5576c',
    screen: 'allProductsScreen'
  },
  {
    id: 2,
    icon: 'megaphone-outline',
    title: 'Advertisement',
    bottomTitle: 'Promote Services',
    description: 'Create and manage promotional campaigns',
    firstColor: '#00f2fe',
    secondColor: '#4facfe',
    screen: 'postAd'
  },  
  {
    id: 3,
    icon: 'notifications-outline',
    title: 'Notification',
    bottomTitle: 'Broadcast Messages',
    description: 'Send notifications to all users and drivers',
    firstColor: '#667eea',
    secondColor: '#764ba2',
    screen: 'sendNotificationScreen'
  },
  {
    id: 4,
    icon: 'pricetag-outline',
    title: 'Special Offers',
    bottomTitle: 'Best Deals',
    description: 'Create attractive deals and discount offers',
    firstColor: '#ff6b6b',
    secondColor: '#ee5a24',
    screen: ''
  },
  // {
  //   id: 5,
  //   icon: 'cube-outline',
  //   title: 'Inventory',
  //   bottomTitle: 'Stock Management',
  //   description: 'Track and manage recyclable material inventory',
  //   firstColor: '#5f27cd',
  //   secondColor: '#341f97',
  //   screen: ''
  // },
  {
    id: 6,
    icon: 'chatbubbles-outline',
    title: 'Support Tickets',
    bottomTitle: 'Resolve Queries',
    description: 'Handle customer support and complaints',
    firstColor:'#38f9d7',
    secondColor: '#43e97b',
    screen: ''
  },
];

export default function AdminHome() {
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
          onPress={() => navigation.navigate('driverProfileScreen')}
          style={styles.profileSection}
        >
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
        <Graph />
        <AdSlider data={addsData} type={"big"} />
        
        {/* Admin Action Cards */}
        <View style={styles.cardsContainer}>
          {adminCards.map((card, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(card.screen)}
              style={styles.cardWrapper}
            >
              <CurvedCard
                icon={card.icon}
                title={card.title}
                bottomTitle={card.bottomTitle}
                description={card.description}
                firstColor={card.firstColor}
                secondColor={card.secondColor}
              />
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ marginVertical: 20 }}>
          <AdSlider data={addsData} type={"small"} />
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 10,
  },
});

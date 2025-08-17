import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { appFonts, Colors, textStyles } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import MovingIcons from '../../components/MovingIcons';
import shoeIcon from '../../../assets/icons/shoes.png';
import metalIcon from '../../../assets/icons/metal.png';
import AdSlider from '../../components/AdSlider';

const icons = [
  { id: '1', path: require('../../../assets/icons/shoes.png'), label: 'Shoe' },
  {
    id: '2',
    path: require('../../../assets/icons/plastic.png'),
    label: 'Metal',
  },
  {
    id: '3',
    path: require('../../../assets/icons/plastic.png'),
    label: 'Plastic',
  },
  { id: '4', path: require('../../../assets/icons/books.png'), label: 'Paper' },
  {
    id: '5',
    path: require('../../../assets/icons/electronic.png'),
    label: 'Electronics',
  },
  { id: '6', path: require('../../../assets/icons/tank.png'), label: 'Water Tank' },
  { id: '7', path: require('../../../assets/icons/tyre.png'), label: 'Glass' },
  {
    id: '8',
    path: require('../../../assets/icons/battery.png'),
    label: 'Battery',
  },
];

const addsData = [
  {
    url: 'https://st3.depositphotos.com/1561359/13520/v/1600/depositphotos_135200286-stock-illustration-black-running-shoes-ad.jpg',
    height: 180,
    width: '100%',
  },
  {
    url: 'https://webneel.com/daily/sites/default/files/images/daily/02-2016/16-nike-shoe-print-ads-design.jpg',
    height: 180,
    width: '100%',
  },
  {
    url: 'https://plus.unsplash.com/premium_photo-1669644856868-6613f6683346?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    height: 200,
    width: '100%',
  },
];
export default function HomeScreen() {
  return (
    <LinearGradient
      colors={[Colors.primary, Colors.whiteColor]}
      style={{ flex: 1 }}
    >
      <MyStatusBar />
      <View style={styles.topBar}>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1170&auto=format&fit=crop',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>Alok Singh</Text>
        </View>
        <TouchableOpacity style={{ position: 'relative' }}>
          <Ionicons name="cart-outline" size={28} color={Colors.whiteColor} />

          {/* Badge */}
          <View style={styles.badge}>
            <Text
              style={{ ...textStyles.extraSmall, color: Colors.whiteColor }}
            >
              0
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <TouchableOpacity style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#999" />
        <Text style={styles.searchText}>Search here...</Text>
      </TouchableOpacity>

      <ScrollView style={styles.mainSection}>
        {/* ✅ Horizontal scroll of icons */}
        <MovingIcons icons={icons} />
        <AdSlider data={addsData} />

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 20,
          }}
        >
          <Text style={{ color: Colors.blackColor, ...textStyles.subHeading }}>
            Best Deals
          </Text>
          <TouchableOpacity>
            <Text style={{ color: Colors.primary, ...textStyles.subHeading }}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 16,
    fontFamily: appFonts.bold,
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
    padding: 20,
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
});

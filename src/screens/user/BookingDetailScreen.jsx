import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { CommonAppBar } from '../../components/commonComponents';
import { Colors, commonStyles, textStyles } from '../../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BookingDetailScreen = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const flatListRef = useRef();

  // User uploaded images
  const images = [
      'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  // Example items in this booking
  const items = [
    {
      id: 1,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Wooden Chair',
      desc: 'Premium oak chair',
      qty: 2,
      weight: '15kg',
    },
    {
      id: 2,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Table Lamp',
      desc: 'White desk lamp',
      qty: 1,
      weight: '3kg',
    },
    {
      id: 3,
      image:
        'https://plus.unsplash.com/premium_photo-1664283229534-194c0cb5b7da?q=80&w=1080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Cardboard Boxes',
      desc: 'Set of 10 packing boxes',
      qty: 10,
      weight: '20kg',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Booking Details" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Smooth Carousel */}
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          onMomentumScrollEnd={e => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setPreviewImage(item);
                setPreviewVisible(true);
              }}
            >
              <Image source={{ uri: item }} style={styles.image} />
            </TouchableOpacity>
          )}
        />

        <View style={styles.dotsContainer}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, activeIndex === i && styles.activeDot]}
            />
          ))}
        </View>
{true && ( 
  <>
    <View style={styles.headingSection}>
      <Text style={styles.sectionTitle}>Driver Details</Text>
    </View>
    <View style={styles.driverCard}>
      <Image
        source={{
          uri: 'https://randomuser.me/api/portraits/men/32.jpg',
        }}
        style={styles.driverImage}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.driverName}>Driver name</Text>
        <Text style={styles.driverPhone}>+91 98765 43210</Text>
        <View style={{ flexDirection: 'row', marginTop: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Text
              key={i}
              style={{ color: i < 4 ? '#FFD700' : '#ccc', fontSize: 16 }}
            >
              ★
            </Text>
          ))}
        </View>
      </View>
    </View>
  </>
)}
<View style={styles.headingSection}>
  <Text style={styles.sectionTitle}>Booking Details</Text>
</View>

<View style={styles.itemsSection}>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Items</Text>
    <Text style={textStyles.small}>7</Text>
  </View>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Pickup Date Time</Text>
    <Text style={textStyles.small}>7/10/25 10AM</Text>
  </View>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Pickup Status</Text>
    <Text style={textStyles.small}>Pending</Text>
  </View>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Driver Allocation</Text>
    <Text style={textStyles.small}>Allocated</Text>
  </View>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Pickup Address</Text>
    <Text style={[textStyles.small, { flex: 1, textAlign: 'right' }]}>
      221B Baker Street, London
    </Text>
  </View>
  <View style={commonStyles.rowSpaceBetween}>
    <Text style={textStyles.smallBold}>Expected Price</Text>
    <Text style={textStyles.small}>₹120</Text>
  </View>
</View>



       
        <View style={styles.headingSection}>
          <Text style={styles.sectionTitle}>Item In this Booking</Text>
        </View>
        <View style={styles.itemsSection}>
          {items.map(item => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <Text style={styles.itemInfo}>
                  Qty: {item.qty} | {item.weight}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerBtn, { backgroundColor: Colors.secondary }]}
        >
          <Text style={styles.footerBtnText}>Cancel Booking</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={previewVisible} transparent>
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewImage }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setPreviewVisible(false)}
          >
            <Text
              style={{
                color: Colors.blackColor,
                fontSize: 16,
                fontWeight: '700',
              }}
            >
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default BookingDetailScreen;

const styles = StyleSheet.create({
  image: {
    width: width,
    height: 240,
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
     borderRadius: 50,
    backgroundColor: Colors.primary,
  },

  itemsSection: {
    marginHorizontal: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
   
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.whiteColor,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  itemDesc: {
    fontSize: 13,
    color: '#777',
    marginVertical: 2,
  },
  itemInfo: {
    fontSize: 12,
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    padding: 12,
    elevation: 10,
  },
  footerBtn: {
    backgroundColor: Colors.errorColor,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  footerBtnText: {
    color: Colors.whiteColor,
    fontWeight: '600',
    fontSize: 15,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'rgba(23, 22, 22, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },
  closeBtn: {
    marginTop: 20,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.whiteColor,
    borderRadius: 25,
  },
headingSection: {
  borderTopWidth: 1,
  borderBottomWidth: 1,
  borderColor: Colors.extraLightGrayColor,
  marginVertical: 8,
  paddingVertical: 8,   
  flexDirection: 'row', 
  alignItems: 'center',
  justifyContent: 'center',
  marginHorizontal: 4,
},
driverCard: {
  flexDirection: 'row',
  backgroundColor: Colors.whiteColor,
  padding: 12,
  marginHorizontal: 12,
  marginVertical: 10,
  
},
driverImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
},
driverName: {
  fontSize: 15,
  fontWeight: '600',
},
driverPhone: {
  fontSize: 13,
  color: '#777',
},

});

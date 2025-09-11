import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selector';
import Key from '../../constants/key';
import { WarningWithButton } from '../lottie/WarningWithButton';

const { width: screenWidth } = Dimensions.get('window');

const AdSlider = ({ data, type }) => {
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [warningVisible, setWarningVisible] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState('');
  const flatListRef = useRef(null);
  const indexRef = useRef(currentIndex);
  console.log("data ",data)
  //(16:9 for big, ~3.5:1 for strip).
  const width = screenWidth - 60;
  const height = type === 'big' ? (width * 9) / 16 : width / 3.5;

  // Sync ref with state
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  // Auto slider (runs only once)
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const interval = setInterval(() => {
      let nextIndex = (indexRef.current + 1) % data.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 10000);

    return () => clearInterval(interval);
  }, [data]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleAdPress = (item) => {
    if (item?.redirectUrl) {
      setSelectedUrl(item.redirectUrl);
      setWarningVisible(true);
    }
  };

  const handleRedirect = () => {
    setWarningVisible(false);
    if (selectedUrl) {
      Linking.openURL(selectedUrl).catch(err => console.error('Failed to open URL:', err));
    }
  };

  return (
    <View>
      <FlatList
        data={data}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          console.log('Ad item:', item);
          const imageUri = item?.imageUrl;
          const fullImageUrl = imageUri ? API_BASE_URL + imageUri : 'https://t3.ftcdn.net/jpg/03/76/97/16/360_F_376971659_OSsR8oqHDuyoovcqqi2KNcHRKKVA9QqO.jpg';
          // console.log('Image URL:', fullImageUrl);
          
          return (
            <TouchableOpacity 
              style={[styles.adBox, { height: height, width: width }]}
              onPress={() => handleAdPress(item)}
              activeOpacity={0.9}
            >
              <Image
                source={{
                  uri: fullImageUrl,
                  headers: imageUri ? {
                    Authorization: `Bearer ${user?.accessToken}`,
                  } : undefined,
                }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) => console.log('Image load error:', error)}
                onLoad={() => console.log('Image loaded successfully')}
              />
              <View style={styles.adLabel}>
                <Text style={styles.adText}>Ad</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.3 }]}
          />
        ))}
      </View>
      
      {warningVisible && (
        <WarningWithButton
          message="Are you sure you want to visit this Ad?"
          onYes={handleRedirect}
          onClose={() => setWarningVisible(false)}
          yesText="Visit"
          noText="Cancel"
          loop={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  adBox: {
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  adLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(164,150,150,0.5)',
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  adText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
  imageBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default AdSlider;

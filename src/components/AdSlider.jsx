import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  Text,
  StyleSheet,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const AdSlider = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const indexRef = useRef(currentIndex);

  // Sync ref with state
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  // Auto slider (runs only once)
  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (indexRef.current + 1) % data.length;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <View>
      <FlatList
        data={data}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.adBox,
              { height: item.height, width: screenWidth - 60 }, 
            ]}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.image}
              resizeMode="cover" 
            />
            <View style={styles.adLabel}>
              <Text style={styles.adText}>Ad</Text>
            </View>
          </View>
        )}
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

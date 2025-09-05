import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {textStyles ,Colors} from '../../styles/commonStyles';

const { width: screenWidth } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    image: require('../../../assets/images/onboarding1.png'), // Suggested image: A user scheduling a pickup on their phone.
    title: 'Schedule a Scrap Pickup',
    subtitle: 'Easily book a convenient time for us to collect scrap right from your doorstep.',
  },
  {
    id: '2',
    image: require('../../../assets/images/onboarding2.png'), // Suggested image: A friendly driver weighing scrap items.
    title: 'Hassle-Free Collection',
    subtitle: 'Our assigned driver will arrive at your location, weigh your items, and handle all the heavy lifting.',
  },
  {
    id: '3',
    image: require('../../../assets/images/onboarding3.png'), // Suggested image: A user happily receiving cash.
    title: 'Get Paid Instantly',
    subtitle: 'Receive instant cash for your scrap on the spot. Turning trash into treasure has never been easier!',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('login');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 3 }}>
        <FlatList
          data={onboardingData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            {
              useNativeDriver: false,
            }
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      <View style={styles.footer}>
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, i) => {
            const inputRange = [
              (i - 1) * screenWidth,
              i * screenWidth,
              (i + 1) * screenWidth,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp'
            })

            return (
              <Animated.View
                key={i.toString()}
                style={[styles.indicator, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={scrollTo}
          style={styles.nextButton}
        >
        <MaterialIcons name="arrow-forward-ios" size={30} color={Colors.whiteColor} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    resizeMode: 'contain',
    marginBottom: 40,
  },
 title: {
  ...textStyles.subHeading, 
  color: Colors.primary,
  textAlign: 'center',
  marginBottom: 10,
},

  subtitle: {
   ...textStyles.small, 
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    width: '100%',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginHorizontal: 3,
  },
  nextButton: {
    position: 'absolute',
    bottom: 50,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, textStyles } from '../../styles/commonStyles';

const { width } = Dimensions.get('window');

const getItemColor = (label) => {
  const colorMap = {
    'Shoe': '#8B4513',
    'Plastic': '#FF6B35',
    'Metal': '#708090',
    'Paper': '#32CD32',
    'Electronics': '#4169E1',
    'Water Tank': '#00CED1',
    'Tyre': '#2F4F4F',
    'Battery': '#FFD700',
    'Garbage': '#8FBC8F',
    'Carton': '#DEB887',
  };
  return colorMap[label] || Colors.primary;
};

export default function MovingIcons({ icons }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  useEffect(() => {
    let offsetX = 0;
    const totalWidth = icons.length * 80; // item approx width
    const scrollInterval = setInterval(() => {
      offsetX += 1; // speed (1 = very slow)
      if (offsetX > totalWidth) {
        offsetX = 0; // reset back to start
      }
      scrollViewRef.current?.scrollTo({ x: offsetX, animated: false });
    }, 50); // lower = faster

    return () => clearInterval(scrollInterval);
  }, [icons]);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 5 }}
      style={{
        marginBottom: 20,
        borderWidth: 1,
        borderColor: Colors.extraLightGrayColor,
        paddingVertical: 5,
        borderRadius: 10,
      }}
    >
      {icons.concat(icons).map((item, index) => (
        <View
          key={index}
          style={{ alignItems: 'center', marginHorizontal: 10 }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 25,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: getItemColor(item.label),
              backgroundColor: `${getItemColor(item.label)}15`,
            }}
          >
            <Image
              source={item.path}
              style={{ width: 30, height: 30, tintColor: getItemColor(item.label) }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: getItemColor(item.label),
              ...textStyles.extraSmall,
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

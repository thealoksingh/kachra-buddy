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
              borderColor: Colors.grayColor,
            }}
          >
            <Image
              source={item.path}
              style={{ width: 30, height: 30, tintColor: Colors.grayColor }}
              resizeMode="contain"
            />
          </View>
          <Text
            style={{
              color: Colors.grayColor,
              ...textStyles.extraSmall,
              textAlign: 'center',
            }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import { Colors, textStyles } from '../../styles/commonStyles';

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
  const translateX = useRef(new Animated.Value(0)).current;
  const itemWidth = 70;
  const totalWidth = icons.length * itemWidth;
  
  const doubledIcons = useMemo(() => icons.concat(icons), [icons]);

  useEffect(() => {
    const startAnimation = () => {
      translateX.setValue(0);
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -totalWidth,
          duration: totalWidth * 50,
          useNativeDriver: true,
        })
      ).start();
    };
    
    startAnimation();
  }, [translateX, totalWidth]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {doubledIcons.map((item, index) => {
          const color = getItemColor(item.label);
          return (
            <View key={index} style={styles.itemContainer}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    borderColor: color,
                    backgroundColor: `${color}15`,
                  },
                ]}
              >
                <Image
                  source={item.path}
                  style={[styles.iconImage, { tintColor: color }]}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.labelText, { color }]}>
                {item.label}
              </Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 10,
    overflow: 'hidden',
  },
  animatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemContainer: {
    alignItems: 'center',
    width: 70,
    marginHorizontal: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 4,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  labelText: {
    ...textStyles.extraSmall,
    textAlign: 'center',
    fontWeight: '500',
  },
});

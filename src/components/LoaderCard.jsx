import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import { Colors } from '../styles/commonStyles';
export function LoaderCard({ count = 1, cardHeight = 80 }) {

    const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect (() => {
    Animated.loop(
      Animated.timing(shimmerValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerStyle = {
    opacity: shimmerValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
  };

  const renderPlaceholder = (width = "80%", height = cardHeight, marginBottom = 8) => (
    <Animated.View
      key={Math.random().toString()}
      style={[
        {
          width,
          height,
          backgroundColor: Colors.extraLightGrayColor,
          borderRadius: 4,
          marginBottom,
        },
        shimmerStyle,
      ]}
    />
  );

  const renderSkeletonCard = () => (
    <View
      style={[styles.userItem, { height: cardHeight, justifyContent: "center" }]}
      key={Math.random().toString()}
    >
      {renderPlaceholder("90%", cardHeight * 0.6)} 
      {renderPlaceholder("60%", cardHeight * 0.5)}
      {renderPlaceholder("40%", cardHeight * 0.2)}
    </View>
  );

  return <>{Array.from({ length: count }, renderSkeletonCard)}</>;
}

const styles = StyleSheet.create({
  userItem: {
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
  },
});
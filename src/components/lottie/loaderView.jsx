
import React from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

const LottieOverlay = ({ source, size = 100, overlay = false, loop = true }) => {
  return (
    <View
      style={{
        position: overlay ? "absolute" : "relative",
        top: overlay ? 0 : undefined,
        left: overlay ? 0 : undefined,
        right: overlay ? 0 : undefined,
        bottom: overlay ? 0 : undefined,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: overlay ? "rgba(255, 255, 255, 0.29)" : "transparent",
        zIndex: 999,
      }}
    >
      <LottieView
        source={source}
        autoPlay
        loop={loop}
        style={{ width: size, height: size }}
      />
    </View>
  );
};

export const DottedWhiteLoader = () => (
  <LottieOverlay
    source={require("./animatedLoader1.json")}
    size={40}
    overlay={false}
    loop
  />
);


export const DottedBlackLoader = () => (
  <LottieOverlay
    source={require("./animatedLoader2.json")}
    size={100}
    overlay
    loop
  />
);

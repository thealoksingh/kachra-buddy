import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  Colors,
  commonStyles,
  screenWidth,
} from "../styles/commonStyles";







export function SupportTicket({ issue, navigation }) {
  return (
    <TouchableOpacity
    activeOpacity={0.7}
      onPress={() => navigation.navigate("SupportIssuesDetail", { issue })}
      style={styles.userItem}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Status: </Text>
        <Text style={[styles.description, { color: "red" }]}>{issue?.status}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Created at: </Text>
        <Text style={styles.description}>{issue?.created_at}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.title}>Title: </Text>
        <Text style={styles.description}>{issue?.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userItem: {
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    ...commonStyles.shadow,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 0.1,
    borderTopWidth: 1.0,
    minHeight: 100,
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.blackColor,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.extraLightGrayColor,
    marginLeft: 78,
  },
});
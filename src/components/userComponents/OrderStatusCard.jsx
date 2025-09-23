import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const OrderStatusCard = ({orderStatus}) => {
  const steps = [
    { label: "Order Confirmed", date: "Thu Sep 25", status: "done" },
    { label: "Driver Allocated", date: "Thu Sep 25", status: "pending" },
    { label: "Out for Pickup", date: "Sep 27 (8:00 AM - 7:55 PM)", status: "pending" },
    { label: "Picked up", date: "Sep 27 (8:00 AM - 7:55 PM)", status: "pending" },
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Order Confirmed</Text>
      <Text style={styles.subtitle}>Your Order has been placed.</Text>

  <View style={styles.progressContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
             <View style={styles.iconColumn}>
              <Ionicons
                name={
                  step.status === "done" ? "checkmark-circle" : "ellipse-outline"
                }
                size={22}
                color={step.status === "done" ? "#22c55e" : "#9ca3af"}
              />
               {index !== steps.length - 1 && (
                <View style={styles.verticalLine} />
              )}
            </View>

             <View style={styles.textColumn}>
              <Text style={styles.stepLabel}>{step.label}</Text>
              <Text style={styles.stepDate}>{step.date}</Text>
            </View>
          </View>
        ))}
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    margin: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d0d1d3ff",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111827",
  },
  subtitle: {
    fontSize: 13,
    color: "#4b5563",
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconColumn: {
    alignItems: "center",
    width: 30,
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
    paddingLeft: 8,
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  stepDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});

export default OrderStatusCard;

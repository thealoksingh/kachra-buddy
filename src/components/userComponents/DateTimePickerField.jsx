import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Colors } from "../../styles/commonStyles";

export default function DateTimePickerField({ value, onChange }) {
  const [open, setOpen] = useState(false);

  // format date -> dd/mm/yyyy hh:mm AM/PM
  const formatDate = (iso) => {
    if (!iso) return "Select Date & Time";
    const date = new Date(iso);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Pickup Date & Time</Text>
      
      <View style={styles.inputContainer}>
        <View style={styles.displayBox}>
          <MaterialIcons 
            name="schedule" 
            size={20} 
            color={value ? "#4CAF50" : "#999"} 
            style={styles.icon}
          />
          <Text style={[styles.dateText, !value && styles.placeholderText]}>
            {formatDate(value)}
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.pickBtn} 
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <View
               style={styles.gradientBtn}
          
          >
            <MaterialIcons name="edit-calendar" size={18} color="white" />
            <Text style={styles.btnText}>Pick</Text>
          </View>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={open}
        date={value ? new Date(value) : new Date()}
        mode="datetime"
        title="Select Pickup Time"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={(date) => {
          setOpen(false);
          onChange?.(date.toISOString());
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color:Colors.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  displayBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
   
  },
  icon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
    fontStyle: 'italic',
  },
  pickBtn: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  gradientBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor:Colors.secondaryLight,
    gap: 6,
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

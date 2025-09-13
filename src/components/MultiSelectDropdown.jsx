import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../styles/commonStyles';

const MultiSelectDropdown = ({ 
  label, 
  placeholder, 
  options, 
  selectedValues, 
  onSelectionChange,
  optional = true 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleOption = (option) => {
    const isSelected = selectedValues.includes(option);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedValues.filter(item => item !== option);
    } else {
      newSelection = [...selectedValues, option];
    }
    
    onSelectionChange(newSelection);
  };

  const removeTag = (tag) => {
    const newSelection = selectedValues.filter(item => item !== tag);
    onSelectionChange(newSelection);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {!optional && <Text style={styles.required}>*</Text>}
      </Text>
      
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsVisible(true)}
      >
        <Text style={[styles.dropdownText, !selectedValues.length && styles.placeholder]}>
          {selectedValues.length ? `${selectedValues.length} selected` : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.grayColor} />
      </TouchableOpacity>

      {selectedValues.length > 0 && (
        <View style={styles.tagsContainer}>
          {selectedValues.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity onPress={() => removeTag(tag)}>
                <Ionicons name="close" size={16} color={Colors.whiteColor} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.blackColor} />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => toggleOption(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                  {selectedValues.includes(item) && (
                    <Ionicons name="checkmark" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsVisible(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.primary,
  },
  required: {
    color: Colors.secondary,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.whiteColor,
  },
  dropdownText: {
    fontSize: 14,
    color: Colors.blackColor,
  },
  placeholder: {
    color: Colors.grayColor,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    color: Colors.whiteColor,
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrayColor,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  optionText: {
    fontSize: 16,
    color: Colors.blackColor,
  },
  doneButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MultiSelectDropdown;
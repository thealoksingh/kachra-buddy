import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors, Sizes, textStyles } from '../../styles/commonStyles';

const ItemSelectionModal = ({ visible, items, onClose, onAddItem }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (selectedItem && quantity && parseFloat(quantity) > 0) {
      onAddItem(selectedItem, quantity);
      setSelectedItem(null);
      setQuantity('');
      onClose();
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.itemCard,
        selectedItem?.id === item.id && styles.selectedItem
      ]}
      onPress={() => setSelectedItem(item)}
    >
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemPrice}>₹{item.pricePerUnit}/{item.unit}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Additional Items</Text>
          
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.itemsList}
          />
          
          {selectedItem && (
            <View style={styles.quantitySection}>
              <Text style={styles.selectedItemText}>
                Selected: {selectedItem.name}
              </Text>
              <TextInput
                style={styles.quantityInput}
                placeholder="Enter quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>
          )}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.addBtn, !selectedItem && styles.disabledBtn]} 
              onPress={handleAddItem}
              disabled={!selectedItem || !quantity}
            >
              <Text style={styles.addText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.primary,
  },
  itemsList: {
    maxHeight: 300,
  },
  itemCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    marginBottom: 8,
  },
  selectedItem: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: Colors.grayColor,
    marginTop: 4,
  },
  quantitySection: {
    marginTop: 16,
    padding: 12,
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: 8,
  },
  selectedItemText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: Colors.grayColor,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.grayColor,
    marginRight: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.grayColor,
    fontWeight: '600',
  },
  addBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: Colors.grayColor,
  },
  addText: {
    color: Colors.whiteColor,
    fontWeight: '600',
  },
});

export default ItemSelectionModal;
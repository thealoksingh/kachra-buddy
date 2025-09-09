import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors, screenWidth, textStyles } from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const EditableOrderCard = ({ price, type, itemName, quantity: initialQuantity, unit, orderItem, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity?.toString() || '');
  const [weight, setWeight] = useState(initialQuantity?.toString() || '');

  const handleQuantityChange = (value) => {
    setQuantity(value);
    onQuantityChange?.(value);
  };

  const handleWeightChange = (value) => {
    setWeight(value);
    onQuantityChange?.(value);
  };

  return (
    <View style={styles.card}>
     
      <Image
        source={{
          uri: orderItem?.item?.imageUrl ? `${require('../../constants/key').default.API_BASE_URL}${orderItem.item.imageUrl}` : 'https://images.unsplash.com/photo-1722695510527-cc033e43be1b?q=80&w=1170&auto=format&fit=crop',
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Details Section */}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text style={styles.title} numberOfLines={1}>
          {itemName || 'Item Name'}
        </Text>
      
        <Text style={styles.rate}>
          Rate: ₹{orderItem?.item?.pricePerUnit || price}  {type === 'countable' ? 'per piece' : `per ${orderItem?.item?.unit || 'kg'}`}
        </Text>

        {/* Conditional Input */}
        {type === 'countable' ? (
          <View style={styles.inputRow}>
            <Text style={styles.label}>Qty:</Text>
            <TextInput
              value={quantity}
              onChangeText={handleQuantityChange}
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
            />
          </View>
        ) : (
          <View style={styles.inputRow}>
            <Text style={styles.label}>W(Kg)</Text>
            <TextInput
              value={weight}
              onChangeText={handleWeightChange}
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default EditableOrderCard;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    width: "auto",
    height: 140,
    backgroundColor:Colors.whiteColor,
    borderRadius: 8,
    marginTop: 10,
    position: 'relative',
    shadowColor: '#424141ff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  image: {
    height: '100%',
    width: 120,
    borderRadius: 8,
  },
  title: {
    ...textStyles.smallBold,
    color: '#222',
  },
  desc: {
    ...textStyles.extraSmall,
    color: Colors.grayColor,
    marginVertical: 4,
  },
  rate: {
    fontSize: 12,
    color: Colors.primaryColor,
    marginVertical: 1,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 12,
    marginRight: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 38,
    flex: 1,
    backgroundColor: '#fafafa',
  },
});

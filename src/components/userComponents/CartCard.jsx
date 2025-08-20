import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors, screenWidth, textStyles } from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CartCard = ({ price, type, description, deleteMethod }) => {
  const [quantity, setQuantity] = useState('');
  const [weight, setWeight] = useState('');

  return (
    <View style={styles.card}>
      {/* Delete Button */}
      <TouchableOpacity style={styles.deleteBtn} onPress={deleteMethod}>
        <MaterialIcons name="delete" size={22} color="#d9534f" />
      </TouchableOpacity>

      {/* Image Section */}
      <Image
        source={{
          uri: 'https://images.unsplash.com/photo-1722695510527-cc033e43be1b?q=80&w=1170&auto=format&fit=crop',
        }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Details Section */}
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Text style={styles.title} numberOfLines={1}>
          Title here
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {description || 'Description goes here'}
        </Text>

        <Text style={styles.rate}>
          Rate: {type === 'countable' ? 'per piece' : 'per kg'}
        </Text>

        {/* Conditional Input */}
        {type === 'countable' ? (
          <View style={styles.inputRow}>
            <Text style={styles.label}>Qty:</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="0"
              style={styles.input}
            />
          </View>
        ) : (
          <View style={styles.inputRow}>
            <Text style={styles.label}>Weight (Kg):</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
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

export default CartCard;

const styles = StyleSheet.create({
  card: {
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    width: screenWidth - 20,
    height: 180,
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
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 2,
    padding: 4,
  },
  image: {
    height: '100%',
    width: 120,
    borderRadius: 8,
  },
  title: {
    ...textStyles.subHeading,
    color: '#222',
  },
  desc: {
    ...textStyles.small,
    color: Colors.grayColor,
    marginVertical: 4,
  },
  rate: {
    fontSize: 14,
    color: Colors.primaryColor,
    marginVertical: 6,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    marginRight: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 38,
    width: 120,
    backgroundColor: '#fafafa',
  },
});

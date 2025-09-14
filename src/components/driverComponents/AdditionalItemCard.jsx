import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { Colors } from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { selectUser } from '../../store/selector';
import Key from '../../constants/key';

const AdditionalItemCard = ({ item, onQuantityChange, onRemove }) => {
  const [quantity, setQuantity] = useState('');
  const { API_BASE_URL } = Key;
  const user = useSelector(selectUser);
  const handleQuantityChange = value => {
    setQuantity(value);
    onQuantityChange(item.id, value);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.imageContainer}>
          <Image
            source={
              item?.imageUrl
                ? {
                    uri: API_BASE_URL + item?.imageUrl,
                    headers: {
                      Authorization: `Bearer ${user?.accessToken}`,
                    },
                  }
                : {
                    uri: 'https://t3.ftcdn.net/jpg/03/76/97/16/360_F_376971659_OSsR8oqHDuyoovcqqi2KNcHRKKVA9QqO.jpg',
                  }
            }
            style={styles.itemImage}
            resizeMode="cover"
          />
        </View>

        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item?.name || 'Item Name'}</Text>
          {/* <Text style={styles.itemCategory}>
            {item?.category || 'Category'}
          </Text> */}
          <Text style={styles.itemPrice}>
            ₹{item?.pricePerUnit || 0}/{item?.unit || 'kg'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(item.id)}
        >
          <MaterialIcons name="close" size={20} color={Colors.redColor} />
        </TouchableOpacity>
      </View>

      <View style={styles.inputSection}>
        <Text style={styles.inputLabel}>Quantity ({item?.unit || 'kg'})</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.quantityInput}
            placeholder="0"
            placeholderTextColor={Colors.grayColor}
            value={quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
          />
          <Text style={styles.unitText}>{item?.unit || 'kg'}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.grayColor,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  removeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.extraLightGrayColor,
  },
  inputSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fbfbfbff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    paddingHorizontal: 12,
    height: 40,
  },
  quantityInput: {
    flex: 1,
    fontSize: 12,
    color: Colors.blackColor,
    fontWeight: '500',
  },
  unitText: {
    fontSize: 14,
    color: Colors.grayColor,
    fontWeight: '500',
  },
});

export default AdditionalItemCard;

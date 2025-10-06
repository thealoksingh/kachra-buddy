import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const BestDealCard = ({ product, theme }) => {
  const cardTheme = theme;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardTheme.cardBackground,
          borderColor: cardTheme.border,
          shadowColor: cardTheme.shadow,
        },
      ]}
    >
      {true && (
        <View style={[styles.badge, { backgroundColor: cardTheme.primary }]}>
          <MaterialIcons name="star" size={12} color={cardTheme.white} />
          <Text style={[styles.badgeText, { color: cardTheme.text }]}>
            Best Deal
          </Text>
        </View>
      )}

      <View
        style={[styles.imageContainer, { backgroundColor: cardTheme.white }]}
      >
        <Image
          source={{ uri: product?.image || 'https://via.placeholder.com/100' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.productInfo}>
        <Text
          style={[styles.productTitle, { color: cardTheme.text }]}
          numberOfLines={2}
        >
          {product?.title || 'Product Name'}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={[styles.currentPrice, { color: cardTheme.border }]}>
            ₹{product?.currentPrice}/{product?.unit}
          </Text>
        </View>

        {true ? (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: cardTheme.secondary,
                borderColor: cardTheme.border,
              },
            ]}
          >
            <Text style={[styles.actionButtonText, { color: cardTheme.text }]}>
              Remove
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: cardTheme.greenishLight,
                borderColor: cardTheme.greenishDark,
              },
            ]}
          >
            <Text style={[styles.actionButtonText, { color: cardTheme.text }]}>
              Add
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  imageContainer: {
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    // textAlign:"center",
    lineHeight: 18,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentPrice: {
    fontSize: 12,
    // textAlign:"center",
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  discountContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default BestDealCard;

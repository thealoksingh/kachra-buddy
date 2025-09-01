import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { CommonAppBar } from '../../components/commonComponents';
import CartCard from "../../components/userComponents/CartCard";
import { Colors, Fonts } from '../../styles/commonStyles';
import { ButtonWithLoader } from '../../components/commonComponents';
import { useNavigation } from '@react-navigation/native';

const Cart = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <CommonAppBar navigation={navigation} label={'Cart'} />

      {/* Cart Items */}
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.itemsContainer}>
          <CartCard />
          <CartCard />
          <CartCard />
          <CartCard />
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View style={styles.bottomContainer}>
        <View style={styles.calculationContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹1200</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax</Text>
            <Text style={styles.value}>₹100</Text>
          </View>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={[styles.label, { fontFamily: Fonts.bold }]}>Total</Text>
            <Text style={[styles.value, { fontFamily: Fonts.bold }]}>₹1300</Text>
          </View>
        </View>

        <ButtonWithLoader
          name="Continue"
          loadingName="Processing..."
          isLoading={loading}
          method={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigation.navigate('checkoutScreen'); 
            }, 1500);
          }}
        />
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  itemsContainer: {
    flexDirection: "column",
    alignItems: "center",
    paddingBottom:10,
    justifyContent: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calculationContainer: {
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    color: "#555",
  },
  value: {
    fontSize: 12,
    color: "#111",
  },
});

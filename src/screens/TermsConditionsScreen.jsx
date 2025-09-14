import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CommonAppBar } from '../components/commonComponents';
import { Colors, textStyles } from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

export default function TermsConditionsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CommonAppBar label="Terms & Conditions" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Text style={styles.sectionTitle}>1. Service Overview</Text>
        <Text style={styles.text}>
          Kachra Buddy provides online scrap collection services. We collect recyclable materials including paper, plastic, metal, electronics, and other approved items from your location.
        </Text>

        <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
        <Text style={styles.text}>
          You agree to:
          {'\n'}• Provide accurate pickup information
          {'\n'}• Ensure scrap items are clean and sorted
          {'\n'}• Be available during scheduled pickup times
          {'\n'}• Not include hazardous or prohibited materials
          {'\n'}• Pay applicable fees promptly
        </Text>

        <Text style={styles.sectionTitle}>3. Pickup Services</Text>
        <Text style={styles.text}>
          • Pickup scheduling is subject to availability
          {'\n'}• Minimum quantity requirements may apply
          {'\n'}• We reserve the right to refuse certain materials
          {'\n'}• Pickup times are estimates, not guarantees
          {'\n'}• Rescheduling may incur additional charges
        </Text>

        <Text style={styles.sectionTitle}>4. Pricing & Payment</Text>
        <Text style={styles.text}>
          • Prices are based on current market rates
          {'\n'}• Rates may vary by material type and quantity
          {'\n'}• Payment processed after material verification
          {'\n'}• Service fees may apply for certain pickups
          {'\n'}• Disputes must be raised within 24 hours
        </Text>

        <Text style={styles.sectionTitle}>5. Prohibited Items</Text>
        <Text style={styles.text}>
          We do not collect:
          {'\n'}• Hazardous chemicals or materials
          {'\n'}• Medical or biological waste
          {'\n'}• Radioactive materials
          {'\n'}• Explosive or flammable substances
          {'\n'}• Contaminated or dirty items
        </Text>

        <Text style={styles.sectionTitle}>6. Limitation of Liability</Text>
        <Text style={styles.text}>
          Our liability is limited to the value of materials collected. We are not responsible for indirect damages, lost profits, or consequential losses.
        </Text>

        <Text style={styles.sectionTitle}>7. Contact Information</Text>
        <Text style={styles.text}>
          For support or questions:
          {'\n'}Email: support@kachrabuddy.com
          {'\n'}Phone: +91-XXXXXXXXXX
          {'\n'}Address: [Your Business Address]
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    ...textStyles.heading,
    color: Colors.blackColor,
    marginBottom: 8,
  },
  lastUpdated: {
    ...textStyles.small,
    color: Colors.grayColor,
    marginBottom: 20,
  },
  sectionTitle: {
    ...textStyles.subHeading,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    ...textStyles.medium,
    color: Colors.blackColor,
    lineHeight: 22,
    marginBottom: 12,
  },
});
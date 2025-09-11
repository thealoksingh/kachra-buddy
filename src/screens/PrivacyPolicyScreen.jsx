import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { CommonAppBar } from '../components/commonComponents';
import { Colors, textStyles } from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <CommonAppBar label="Privacy Policy" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect information you provide when using our scrap collection services:
          {'\n'}• Personal details (name, phone, address)
          {'\n'}• Location data for pickup services
          {'\n'}• Scrap item details and photos
          {'\n'}• Payment and transaction information
        </Text>

        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          Your information helps us:
          {'\n'}• Schedule and manage scrap pickups
          {'\n'}• Process payments and transactions
          {'\n'}• Improve our collection services
          {'\n'}• Send service notifications and updates
          {'\n'}• Ensure safety and security
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.text}>
          We may share your information with:
          {'\n'}• Our collection partners and drivers
          {'\n'}• Payment processors for transactions
          {'\n'}• Legal authorities when required by law
          {'\n'}We never sell your personal data to third parties.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.text}>
          We implement security measures to protect your data including encryption, secure servers, and access controls. However, no method of transmission is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          You have the right to:
          {'\n'}• Access your personal data
          {'\n'}• Correct inaccurate information
          {'\n'}• Delete your account and data
          {'\n'}• Opt-out of marketing communications
        </Text>

        <Text style={styles.sectionTitle}>6. Contact Us</Text>
        <Text style={styles.text}>
          For privacy concerns, contact us at:
          {'\n'}Email: privacy@kachrabuddy.com
          {'\n'}Phone: +91-XXXXXXXXXX
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
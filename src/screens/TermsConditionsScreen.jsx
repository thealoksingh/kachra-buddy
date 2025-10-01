import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { CommonAppBar, FaddedIcon } from '../components/commonComponents';
import { Colors, textStyles } from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';
import Key from '../constants/key';

export default function TermsConditionsScreen() {
  const navigation = useNavigation();

  const fullContent = `These Terms and Conditions ("Terms") govern your use of Green Roing mobile application and scrap collection services operated by Green Roing Foundation. By accessing or using our services, you agree to be bound by these Terms and all applicable laws and regulations.

Service Description and Scope: Green Roing provides comprehensive scrap collection, recycling, and waste management services through our mobile platform. Our services include but are not limited to doorstep collection of recyclable materials, waste sorting, processing, and environmentally responsible disposal. We operate as an intermediary connecting users with certified collection partners and recycling facilities to promote sustainable waste management practices.

User Account and Registration: To access our services, you must create an account providing accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.

Service Terms and Conditions: Our collection services are subject to availability, geographic coverage, and minimum quantity requirements. Pickup scheduling is provided on a best-effort basis and may be subject to weather conditions, traffic, and operational constraints. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice.

User Obligations and Responsibilities: Users must ensure that all materials submitted for collection are properly sorted, clean, and free from contamination. You warrant that you have the legal right to dispose of all materials and that such materials do not infringe upon any third-party rights. Users must provide accurate pickup information, be available during scheduled collection times, and comply with all applicable local, state, and federal regulations regarding waste disposal.

Prohibited Materials and Restrictions: We strictly prohibit the collection of hazardous materials, medical waste, radioactive substances, explosive materials, chemicals, biological waste, contaminated items, and any materials that may pose health, safety, or environmental risks. Users who submit prohibited materials may face account suspension, additional fees, and potential legal liability.

Pricing and Payment: We provide doorstep scrap collection services and pay customers for their recyclable materials based on current market rates, material types, quantities, and quality assessment. Prices are subject to change without notice and may vary based on location, demand, and operational costs. Payment to customers occurs after material verification and quality assessment through cash or direct transfer. All disputes regarding pricing or payments must be raised within seventy-two hours of service completion.

Intellectual Property Rights: All content, trademarks, service marks, logos, and intellectual property associated with Green Roing remain the exclusive property of Green Roing Foundation. Users are granted a limited, non-exclusive, non-transferable license to use our services for personal, non-commercial purposes only.

Privacy and Data Protection: Your privacy is important to us. Our collection, use, and protection of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.

Limitation of Liability and Disclaimers: Our services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. We disclaim all warranties, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. Our total liability for any claims arising from or related to our services shall be limited to the fair market value of the materials collected.

Indemnification: You agree to indemnify, defend, and hold harmless Green Roing Foundation, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, losses, costs, and expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.

Termination and Suspension: We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including but not limited to breach of these Terms, fraudulent activity, or violation of applicable laws.

Governing Law and Dispute Resolution: These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Green Roing Foundation operates. Any disputes arising from these Terms or our services shall be resolved through binding arbitration in accordance with applicable arbitration rules.

Modifications and Updates: We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our platform. Your continued use of our services after any modifications constitutes acceptance of the updated Terms.

Contact Information: For questions, concerns, or support regarding these Terms or our services, please contact us at roinggreen@gmail.com or through our official website and support channels.`;

  const handleSeeMore = () => {
    if (Key.tncLink) {
      Linking.openURL(Key.tncLink);
    }
  };

  return (
    <View style={styles.container}>
      <CommonAppBar label="Terms & Conditions" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms & Conditions</Text>
        <Text style={styles.lastUpdated}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>

        <Text style={styles.text}>{fullContent}</Text>

        <TouchableOpacity onPress={handleSeeMore}>
          <Text style={styles.seeMore}>See More</Text>
        </TouchableOpacity>

        <FaddedIcon />
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
  text: {
    fontSize: 11,
    color: Colors.blackColor,
    lineHeight: 16,
    marginBottom: 12,
    textAlign: 'justify',
  },
  seeMore: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    color: '#0578fd',
    marginTop: 4,
    textAlign: 'left',
  },
});

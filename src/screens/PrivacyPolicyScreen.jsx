import React from 'react';
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { CommonAppBar, FaddedIcon } from '../components/commonComponents';
import { Colors, textStyles } from '../styles/commonStyles';
import { useNavigation } from '@react-navigation/native';
import Key from '../constants/key';

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  const fullContent = `This Privacy Policy describes how Green Roing ("we", "our", or "us") collects, uses, and protects your information when you use our scrap collection and recycling services. We are committed to protecting your privacy and ensuring the security of your personal information in accordance with applicable data protection laws and regulations.

Information Collection and Use: We collect personal information that you voluntarily provide to us when registering for our services, scheduling pickups, or communicating with us. This includes but is not limited to your name, contact information, address, location data, photographs of scrap materials, and transaction history. We also automatically collect certain technical information about your device and usage patterns through cookies, log files, and similar technologies to improve our services and user experience.

Data Processing and Legal Basis: We process your personal data based on various legal grounds including contract performance, legitimate business interests, legal compliance, and your consent where applicable. Our processing activities include service delivery, payment processing, customer support, quality assurance, fraud prevention, legal compliance, and business analytics. We implement appropriate technical and organizational measures to ensure data security and integrity.

Data Sharing and Disclosure: We may share your information with trusted third parties including our collection partners, drivers, technology service providers, and legal authorities when required by law or to protect our rights. We do not sell, rent, or trade your personal information to third parties for marketing purposes. All data sharing is conducted under strict confidentiality agreements and data protection standards.

Data Retention and Security: We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. We implement industry-standard security measures including encryption, secure servers, access controls, regular security audits, and employee training to protect your data against unauthorized access, alteration, disclosure, or destruction.

Your Rights and Choices: You have the right to access, correct, update, or delete your personal information. You may also object to certain processing activities, request data portability, and withdraw consent where applicable. You can opt-out of marketing communications and update your preferences through your account settings or by contacting us directly.

Cookies and Tracking Technologies: We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences, though disabling certain cookies may affect functionality.

Third-Party Services: Our app may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.

Children's Privacy: Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

International Data Transfers: If you are located outside our primary jurisdiction, your information may be transferred to and processed in countries with different data protection laws. We ensure appropriate safeguards are in place for such transfers.

Changes to Privacy Policy: We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes through the app or other communication methods.

Contact Information: For questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us at roinggreen@gmail.com or visit our website for additional support options.`;

  const handleSeeMore = () => {
    if (Key.privacyPolicyLink) {
      Linking.openURL(Key.privacyPolicyLink);
    }
  };

  return (
    <View style={styles.container}>
      <CommonAppBar label="Privacy Policy" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy</Text>
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
  sectionTitle: {
    ...textStyles.subHeading,
    color: Colors.primary,
    marginTop: 16,
    marginBottom: 8,
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

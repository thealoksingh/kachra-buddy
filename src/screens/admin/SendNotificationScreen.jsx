import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors, screenWidth } from '../../styles/commonStyles';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SendNotificationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState('global');
  const [selectedUserType, setSelectedUserType] = useState('user');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [titel, setTitle] = useState(null);
  const [showUserList, setShowUserList] = useState(false);

  const maxChars = 100;
  const remainingChars = maxChars - message.length;

  const handleSendNotification = () => {
    setLoading(true);
  };

  const selectUser = () => (
    <>
      {notificationType === 'personalized' && (
        <View style={styles.userSelector}>
          <Text style={styles.sectionLabel}>
            Select User Or Driver
            <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <TouchableOpacity
            style={styles.selectUserButton}
            onPress={() =>
              navigation.navigate('allUsersScreen', {
                fromSelectUser: 'both',
                onUserSelect: user => setSelectedUser(user),
              })
            }
          >
            {selectedUser ? (
              <View style={styles.selectedUserDisplay}>
                {selectedUser.avatar ? (
                  <Image
                    source={{ uri: selectedUser.avatar }}
                    style={styles.selectedUserAvatar}
                  />
                ) : (
                  <View style={styles.selectedAvatarPlaceholder}>
                    <Icon name="person" size={20} color={Colors.grayColor} />
                  </View>
                )}
                <View style={styles.selectedUserInfo}>
                  <Text style={styles.selectedUserName}>
                    {selectedUser.owner_legal_name}
                  </Text>
                  <Text style={styles.selectedUserMobile}>
                    {selectedUser.mobile_number}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectUserText}>Select User</Text>
            )}
            <Icon
              name="keyboard-arrow-down"
              size={24}
              color={Colors.grayColor}
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.whiteColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CommonAppBar navigation={navigation} label="Send Notification" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.typeSelector}>
            <Text style={styles.sectionLabel}>
              Notification Type
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <View style={styles.typeButtons}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  notificationType === 'global' && styles.selectedType,
                ]}
                onPress={() => setNotificationType('global')}
              >
                <Text
                  style={[
                    styles.typeText,
                    notificationType === 'global' && styles.selectedTypeText,
                  ]}
                >
                  Global
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  notificationType === 'personalized' && styles.selectedType,
                ]}
                onPress={() => setNotificationType('personalized')}
              >
                <Text
                  style={[
                    styles.typeText,
                    notificationType === 'personalized' &&
                      styles.selectedTypeText,
                  ]}
                >
                  Personalized
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {selectUser()}

          <View style={styles.messageContainer}>
            <InputBox
              value={titel}
              setter={setTitle}
              placeholder={'Enter titel of Notification'}
              label={'Titel'}
              optional={false}
              type={'default'}
            />
            <Text style={styles.sectionLabel}>
              Message
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Enter your notification message..."
              placeholderTextColor={Colors.grayColor}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={maxChars}
            />
            <Text
              style={[
                styles.charCount,
                {
                  color:
                    remainingChars >= 0 ? Colors.primary : Colors.secondary,
                },
              ]}
            >
              {remainingChars} characters remaining
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <ButtonWithLoader
            name="Send Notification"
            loadingName="Sending..."
            isLoading={loading}
            method={handleSendNotification}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SendNotificationScreen;

const styles = StyleSheet.create({
  formCard: {
    padding: 16,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.primary,
  },
  typeSelector: {
    marginBottom: 16,
  },
  userTypeSelector: {
    marginBottom: 16,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  typeText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedTypeText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  userSelector: {
    marginBottom: 16,
  },
  selectUserButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
  },
  selectUserText: {
    color: Colors.grayColor,
    fontSize: 12,
  },
  selectedUserDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.blackColor,
  },
  selectedUserMobile: {
    fontSize: 12,
    color: Colors.grayColor,
    marginTop: 2,
  },
  messageContainer: {
    marginBottom: 16,
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    backgroundColor: '#f6f6f6ff',
    padding: 14,
    fontSize: 12,
    color: Colors.blackColor,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
});

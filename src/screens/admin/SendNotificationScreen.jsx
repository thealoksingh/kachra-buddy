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
import { useDispatch } from 'react-redux';
import { Colors, screenWidth } from '../../styles/commonStyles';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { sendNotification } from '../../store/thunks/notificationThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';

const SendNotificationScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [notificationType, setNotificationType] = useState('ORDER');
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const maxChars = 100;
  const remainingChars = maxChars - message.length;

  const handleSendNotification = async () => {
    if (!title || !message) {
      dispatch(showSnackbar({
        message: 'Please fill all required fields',
        type: 'error',
        time: 3000
      }));
      return;
    }

    setLoading(true);
    try {
      const notificationData = {
        userId: selectedUser?.id || 0,
        title,
        message,
        type: notificationType,
        sendWhatsApp,
        sendSMS
      };

      const result = await dispatch(sendNotification(notificationData));
      
      if (sendNotification.fulfilled.match(result)) {
        dispatch(showSnackbar({
          message: 'Notification sent successfully',
          type: 'success',
          time: 3000
        }));
        setTitle('');
        setMessage('');
        setSelectedUser(null);
      } else {
        dispatch(showSnackbar({
          message: 'Failed to send notification',
          type: 'error',
          time: 3000
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({
        message: 'Failed to send notification',
        type: 'error',
        time: 3000
      }));
    } finally {
      setLoading(false);
    }
  };



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
          <InputBox
            value={title}
            setter={setTitle}
            placeholder="Enter notification title"
            label="Title"
          />

          <View style={styles.dropdownContainer}>
            <Text style={styles.sectionLabel}>
              Notification Type
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              <Text style={styles.dropdownText}>{notificationType}</Text>
              <Icon name="keyboard-arrow-down" size={24} color={Colors.grayColor} />
            </TouchableOpacity>
            {showTypeDropdown && (
              <View style={styles.dropdownList}>
                {['ORDER', 'PROMOTION', 'GENERAL', 'SYSTEM'].map(type => (
                  <TouchableOpacity
                    key={type}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setNotificationType(type);
                      setShowTypeDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>


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
                <View style={styles.selectedAvatarPlaceholder}>
                  <Icon name="person" size={20} color={Colors.grayColor} />
                </View>
                <View style={styles.selectedUserInfo}>
                  <Text style={styles.selectedUserName}>
                    {selectedUser.fullName}
                  </Text>
                  <Text style={styles.selectedUserMobile}>
                    {selectedUser.contactNumber}
                  </Text>
                </View>
              </View>
            ) : (
              <Text style={styles.selectUserText}>Select Target User (Optional)</Text>
            )}
            <Icon name="keyboard-arrow-down" size={24} color={Colors.grayColor} />
          </TouchableOpacity>

          <View style={styles.messageContainer}>
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
                  color: remainingChars >= 0 ? Colors.primary : Colors.secondary,
                },
              ]}
            >
              {remainingChars} characters remaining
            </Text>
          </View>

          <View style={styles.communicationOptions}>
            <Text style={styles.sectionLabel}>Communication Channels</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSendWhatsApp(!sendWhatsApp)}
              >
                <Icon
                  name={sendWhatsApp ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={sendWhatsApp ? Colors.primary : Colors.grayColor}
                />
                <Text style={styles.checkboxText}>Send WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setSendSMS(!sendSMS)}
              >
                <Icon
                  name={sendSMS ? 'check-box' : 'check-box-outline-blank'}
                  size={24}
                  color={sendSMS ? Colors.primary : Colors.grayColor}
                />
                <Text style={styles.checkboxText}>Send SMS</Text>
              </TouchableOpacity>
            </View>
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
  dropdownContainer: {
    marginBottom: 16,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    backgroundColor: '#f6f6f6ff',
  },
  dropdownText: {
    fontSize: 12,
    color: Colors.blackColor,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    backgroundColor: Colors.whiteColor,
    marginTop: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.extraLightGrayColor,
  },
  dropdownItemText: {
    fontSize: 12,
    color: Colors.blackColor,
  },
  communicationOptions: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxText: {
    fontSize: 12,
    color: Colors.blackColor,
  },
});

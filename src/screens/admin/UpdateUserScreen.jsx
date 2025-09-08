import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors, screenWidth, Sizes } from '../../styles/commonStyles';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import Icon from 'react-native-vector-icons/MaterialIcons';

const dummyUser = {
  id: 1,
  name: 'alok singh',
  mobNumber: '9876543210',
  email: 'thealoksinghh@gmail.com',
  role: 'driver',
  status: 'active',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
};

const UpdateUserScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(dummyUser.name);
  const [mobNumber, setMobNumber] = useState(dummyUser.mobNumber);
  const [email, setEmail] = useState(dummyUser.email);
  const [role, setRole] = useState(dummyUser.role);
  const [status, setStatus] = useState(dummyUser.status);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [avatar, setAvatar] = useState(dummyUser.avatar);

  const { openCamera, openGallery } = useImagePicker();

  const pickImage = async source => {
    try {
      let result = null;
      if (source === 'camera') result = await openCamera();
      else result = await openGallery();

      if (result?.uri) {
        setAvatar(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };
  const handleUpdateUser = () => {
    console.log('Updated user:', { name, mobNumber, email, role, status, avatar });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Update User" />

      <View style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <TouchableOpacity
              style={styles.avatarPlaceholder}
              onPress={() => setPickerSheetVisible(true)}
            >
              <View style={styles.userIconStyle}>
                <Icon name="person-off" size={60} color="#e0e0eb" />
              </View>
            </TouchableOpacity>
          )}

          {avatar ? (
            <TouchableOpacity
              style={[styles.addIcon, { backgroundColor: Colors.secondary }]}
              onPress={() => setAvatar(null)}
            >
              <Text style={styles.addText}>✕</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addIcon}
              onPress={() => setPickerSheetVisible(true)}
            >
              <Text style={styles.addText}>＋</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.formCard}>
          <InputBox
            value={name}
            setter={setName}
            placeholder="Enter Your Name"
            label="Name"
          />
          <InputBox
            value={mobNumber}
            setter={setMobNumber}
            placeholder="Enter Contact Number"
            label="Contact No."
            type="phone-pad"
          />
          <InputBox
            value={email}
            setter={setEmail}
            placeholder="Enter Your Email Id"
            label="Email"
            type="email"
          />

          <View style={styles.roleSelector}>
            <Text style={styles.sectionLabel}>
              Select Role
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'user' && styles.selectedRole,
                ]}
                onPress={() => setRole('user')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'user' && styles.selectedRoleText,
                  ]}
                >
                  User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'driver' && styles.selectedRole,
                ]}
                onPress={() => setRole('driver')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'driver' && styles.selectedRoleText,
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusSelector}>
            <Text style={styles.sectionLabel}>
              Select Status
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <View style={styles.statusButtons}>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'active' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('active')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'active' && styles.selectedStatusText,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'inactive' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('inactive')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'inactive' && styles.selectedStatusText,
                  ]}
                >
                  Inactive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'blocked' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('blocked')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'blocked' && styles.selectedStatusText,
                  ]}
                >
                  Blocked
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'rejected' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('rejected')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'rejected' && styles.selectedStatusText,
                  ]}
                >
                  Rejected
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <ButtonWithLoader
            name="Update"
            loadingName="Updating..."
            isLoading={loading}
            method={handleUpdateUser}
          />
        </View>
      </View>

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
    </View>
  );
};

export default UpdateUserScreen;

const styles = StyleSheet.create({
  formCard: {
    marginTop: 60,
    padding: 16,
    paddingTop: 60,
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarContainer: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    zIndex: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'lightgray',
  },
  avatarPlaceholder: {
    width: screenWidth / 3.5,
    height: screenWidth / 3.5,
    borderRadius: 60,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  addText: {
    color: Colors.whiteColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userIconStyle: {
    width: screenWidth / 3.5,
    height: screenWidth / 3.5,
    borderRadius: screenWidth / 3.5 / 2.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 2.0,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleSelector: {
    marginTop: 10,
  },

  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedRole: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  roleText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedRoleText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.primary,
  },
  statusSelector: {
    marginTop: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedStatus: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  statusText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedStatusText: {
    color: Colors.primary,
    fontWeight: '500',
  },
});

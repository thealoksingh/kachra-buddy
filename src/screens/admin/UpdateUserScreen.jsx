import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Colors, screenWidth, Sizes } from '../../styles/commonStyles';
import { updateUser } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import Key from '../../constants/key';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
} from '../../components/commonComponents';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import ImagePreviewModal from '../../components/ImagePreviewModal';
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
  const route = useRoute();
  const dispatch = useDispatch();
  const { API_BASE_URL } = Key;
  const user = route.params?.user || {};
  
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user.fullName || '');
  const [mobNumber, setMobNumber] = useState(user.contactNumber || '');
  // const [email, setEmail] = useState(user.email || ''); // Commented out as not required
  const [role, setRole] = useState(user.role || 'USER');
  const [status, setStatus] = useState(user.status || 'ACTIVE');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  // const [pickerSheetVisible, setPickerSheetVisible] = useState(false); // Commented out as not required
  // const [avatar, setAvatar] = useState(user.avatarUrl ? API_BASE_URL + user.avatarUrl : null); // Commented out as not required

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
  const handleUpdateUser = async () => {
    if (!name) {
      dispatch(showSnackbar({
        message: 'Please fill all required fields',
        type: 'error',
        time: 3000
      }));
      return;
    }
    
    setLoading(true);
    try {
      const userData = {
        fullName: name,
        role,
        status
      };
      
      const result = await dispatch(updateUser({ userId: user.id, userData }));
      
      if (updateUser.fulfilled.match(result)) {
        dispatch(showSnackbar({
          message: 'User updated successfully',
          type: 'success',
          time: 3000
        }));
        navigation.goBack();
      } else {
        dispatch(showSnackbar({
          message: 'Failed to update user',
          type: 'error',
          time: 3000
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({
        message: 'Failed to update user',
        type: 'error',
        time: 3000
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Update User" />

      <View style={{ flex: 1, marginHorizontal: 16, marginTop: 20 }}>
        <View style={styles.avatarContainer}>
          {user?.avatarUrl ? (
            <TouchableOpacity
              onPress={() => {
                setPreviewImage(API_BASE_URL + user.avatarUrl);
                setPreviewVisible(true);
              }}
            >
              <Image 
                source={{ 
                  uri: API_BASE_URL + user.avatarUrl,
                  headers: { Authorization: `Bearer ${user?.accessToken}` }
                }} 
                style={styles.avatar} 
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name="person" size={80} color={Colors.extraLightGrayColor} />
            </View>
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
            editable={false}
          />
          {/* Email field commented out as not required
          <InputBox
            value={email}
            setter={setEmail}
            placeholder="Enter Your Email Id"
            label="Email"
            type="email"
          />
          */}

          <View style={styles.roleSelector}>
            <Text style={styles.sectionLabel}>
              Select Role
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'USER' && styles.selectedRole,
                ]}
                onPress={() => setRole('USER')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'USER' && styles.selectedRoleText,
                  ]}
                >
                  User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'DRIVER' && styles.selectedRole,
                ]}
                onPress={() => setRole('DRIVER')}
              >
                <Text
                  style={[
                    styles.roleText,
                    role === 'DRIVER' && styles.selectedRoleText,
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
                  status === 'ACTIVE' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('ACTIVE')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'ACTIVE' && styles.selectedStatusText,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'INACTIVE' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('INACTIVE')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'INACTIVE' && styles.selectedStatusText,
                  ]}
                >
                  Inactive
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'BLOCKED' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('BLOCKED')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'BLOCKED' && styles.selectedStatusText,
                  ]}
                >
                  Blocked
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.statusButton,
                  status === 'REJECTED' && styles.selectedStatus,
                ]}
                onPress={() => setStatus('REJECTED')}
              >
                <Text
                  style={[
                    styles.statusText,
                    status === 'REJECTED' && styles.selectedStatusText,
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

      <ImagePreviewModal
        image={previewImage}
        visibility={previewVisible}
        setVisibility={setPreviewVisible}
      />

      {/* Image picker commented out as not required
      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
      */}
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
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fdfcfcff",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'lightgray',
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

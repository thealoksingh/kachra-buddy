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
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/selector';
import { updateProfilePic, updateUser } from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Key from '../../constants/key';
const EditProfileScreen = () => {
  const { API_BASE_URL } = Key;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [mobNumber, setMobNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const user = useSelector(selectUser);
  const [avatar, setAvatar] = useState(
    user?.avatarUrl ? API_BASE_URL + user.avatarUrl : null,
  );
  console.log('avatar url', avatar);
  const dispatch = useDispatch();

  const { openCamera, openGallery } = useImagePicker();

  const pickImage = async source => {
    try {
      let result = null;
      if (source === 'camera') result = await openCamera();
      else result = await openGallery();

      if (result?.uri) {
        setAvatar(result.uri);
        await uploadProfilePicture(result);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const uploadProfilePicture = async imageData => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const data = {
        userId,
        uri: imageData.uri,
        type: imageData.type,
        name: imageData.fileName || 'profile.jpg',
      };

      const response = await dispatch(updateProfilePic(data));

      if (updateProfilePic.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: 'Profile picture updated successfully!',
            type: 'success',
            time: 3000,
          }),
        );
      } else {
        await dispatch(
          showSnackbar({
            message:
              response?.payload?.message || 'Failed to update profile picture',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      await dispatch(
        showSnackbar({
          message: 'Error uploading image',
          type: 'error',
          time: 3000,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const data = {
        userId,
        fullName: name || user?.fullName,
        contactNumber: mobNumber || user?.contactNumber,
        role: user?.role,
        status: user?.status,
      };

      const response = await dispatch(updateUser(data));

      if (updateUser.fulfilled.match(response)) {
        await dispatch(
          showSnackbar({
            message: 'Profile updated successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        navigation.navigate('home');
      } else {
        await dispatch(
          showSnackbar({
            message: response?.payload?.message || 'Failed to update profile',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      await dispatch(
        showSnackbar({
          message: 'Error updating profile',
          type: 'error',
          time: 3000,
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Edit Profile" />

      <View style={{ flex: 1, marginHorizontal: 16, marginTop: 50 }}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <>
              <Image
                source={{
                  uri: avatar,
                  headers: {
                    Authorization: `Bearer ${user?.accessToken}`,
                  },
                }}
                style={styles.avatar}
              />
            </>
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
            value={user?.fullName || name}
            setter={setName}
            placeholder="Enter Your Name"
            label="Name"
          />
          <InputBox
            value={user?.contactNumber || mobNumber}
            setter={setMobNumber}
            placeholder="Enter Contact Number"
            label="Contact No."
            type="phone-pad"
          />
          {/* <InputBox
            value={email}
            setter={setEmail}
            placeholder="Enter Your Email Id"
            label="Email"
            type="email"
          /> */}
        </View>

        <View style={{ marginTop: 20 }}>
          <ButtonWithLoader
            name="Submit"
            loadingName="Processing..."
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

export default EditProfileScreen;

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
});

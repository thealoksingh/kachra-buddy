import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Colors, screenWidth } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import Key from '../../constants/key';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../store/selector';
import { useNavigation } from '@react-navigation/native';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useImagePicker } from '../../components/useImagePicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteProfilePic, updateProfilePic, updateUser } from '../../store/thunks/userThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { performLogout } from '../../store/thunks/logoutThunk';
const ProfileScreen = () => {
  const { API_BASE_URL } = Key;
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [userName, setUserName] = useState(user?.fullName || 'N/A');
  const [userImage, setUserImage] = useState(user?.avatarUrl || null);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const { openCamera, openGallery } = useImagePicker();

  const pickImage = async source => {
    try {
      let result = null;
      if (source === 'camera') {
        result = await openCamera('1:1', 0.7);
      } else {
        result = await openGallery('1:1', 0.7);
      }

      if (result?.uri) {
        await handleUpdateProfilePic(result);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

 const handleUpdateProfilePic = async imageData => {
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
        dispatch(
          showSnackbar({
            message: 'Profile picture updated successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        setUserImage(response.payload?.avatarUrl);
      } else {
        dispatch(
          showSnackbar({
            message:
              response?.payload?.message || 'Failed to update profile picture',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      dispatch(
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

 
  const handleUpdateName = async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const data = {
        userId,
        fullName: userName || user?.fullName,
        contactNumber: user?.contactNumber,
        role: user?.role,
        status: user?.status,
      };

      const response = await dispatch(updateUser(data));

      if (updateUser.fulfilled.match(response)) {
        dispatch(
          showSnackbar({
            message: 'Profile updated successfully!',
            type: 'success',
            time: 3000,
          }),
        );
        setIsEditingName(false);
      } else {
        dispatch(
          showSnackbar({
            message: response?.payload?.message || 'Failed to update profile',
            type: 'error',
            time: 5000,
          }),
        );
      }
    } catch (error) {
      dispatch(
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



const handleLogout = async () => {
    try {
      await dispatch(performLogout());
      setShowLogoutAlert(false);
      navigation.reset({
        index: 0,
        routes: [{ name: 'auth' }],
      });
      console.log('User logged out successfully');
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  const onRemoveImage = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      await dispatch(deleteProfilePic(userId));
      dispatch(
        showSnackbar({
          message: 'Profile picture removed successfully!',
          type: 'success',
          time: 3000,
        }),
      );
      setPickerSheetVisible(false);
      setUserImage(null);
    } catch (error) {
      setPickerSheetVisible(false);
      dispatch(
        showSnackbar({
          message: 'Failed to remove profile picture',
          type: 'error',
          time: 3000,
        }),
      );
    }
  };


  const handleCancelEdit = () => {
    setIsEditingName(false);
    setUserName(user?.fullName || 'N/A');
  };
  const menuItems = [
    {
      id: 1,
      title: 'Terms & Conditions',
      icon: 'description',
      iconType: 'MaterialIcons',
      backgroundColor: Colors.whiteColor,
      onPress: () => navigation.navigate('termsConditionsScreen'),
    },
    {
      id: 2,
      title: 'Privacy Policy',
      icon: 'privacy-tip',
      iconType: 'MaterialIcons',
      backgroundColor: Colors.whiteColor,
      onPress: () => navigation.navigate('privacyPolicyScreen'),
    },
    {
      id: 3,
      title: 'Logout',
      icon: 'log-out-outline',
      iconType: 'Ionicons',
      backgroundColor: Colors.whiteColor,
      onPress: () => setShowLogoutAlert(true),
    },
  ];

  return (
    <View style={styles.container}>
      <MyStatusBar />
       <View style={[styles.header,{paddingBottom: user?.role == 'ADMIN' ? 20 : 64,
    }]}>
        <View style={[styles.overlayCircle, styles.circle1]} />
        <View style={[styles.overlayCircle, styles.circle2]} />

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <TouchableOpacity
              onPress={() => {
                if (userImage) {
                  setPreviewImage(API_BASE_URL + userImage);
                  setImageModalVisible(true);
                }
              }}
            >
              {userImage ? (
                <Image
                  source={{
                    uri: API_BASE_URL + userImage,
                    headers: { Authorization: `Bearer ${user?.accessToken}` },
                  }}
                  style={styles.profileImage}
                />
              ) : (
                <View
                  style={[
                    styles.profileImage,
                    {
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#eee',
                    },
                  ]}
                >
                
                  <MaterialIcons name="account-circle" size={80} color="#999" />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editImageButton}
              onPress={() => setPickerSheetVisible(true)}
            >
              <MaterialIcons name="edit" size={12} color={Colors.blackColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              {isEditingName ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={userName}
                    onChangeText={setUserName}
                    autoFocus
                    selectTextOnFocus
                  />
                  <View style={styles.editButtons}>
                    <TouchableOpacity
                      onPress={handleUpdateName}
                      style={styles.saveButton}
                    >
                      <MaterialIcons
                        name="check"
                        size={12}
                        color={Colors.whiteColor}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancelEdit}
                      style={styles.cancelButton}
                    >
                      <MaterialIcons
                        name="close"
                        size={12}
                        color={Colors.whiteColor}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.nameDisplayContainer}>
                  <Text style={styles.userName}>{userName}</Text>
                  <TouchableOpacity
                    onPress={()=>setIsEditingName(true)}
                    style={styles.editNameButton}
                  >
                    <MaterialIcons
                      name="edit"
                      size={16}
                      color={Colors.whiteColor}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <Text style={styles.mobNumber}>{user?.contactNumber}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.content,{}]}>
        {user.role != 'ADMIN' && (
          <View style={styles.navigationCards}>
            <TouchableOpacity onPress={()=>navigation.navigate("raisedTickets")} style={styles.navCard}>
              <MaterialIcons
                name="support-agent"
                size={32}
                color={Colors.primary}
              />
              <Text style={styles.navTitle}>Support Tickets</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>navigation.navigate("helpScreen")} style={styles.navCard}>
              <MaterialIcons
                name="help-outline"
                size={32}
                color={Colors.primary}
              />
              <Text style={styles.navTitle}>Customer Support</Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={[
            styles.menuSection,
            { marginTop: user.role == 'ADMIN' ? 60 : 0 },
          ]}
        >
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: item.backgroundColor },
                  ]}
                >
                  {item.iconType === 'MaterialIcons' ? (
                    <MaterialIcons
                      name={item.icon}
                      size={16}
                      color={item.textColor || '#374151'}
                    />
                  ) : (
                    <Ionicons
                      name={item.icon}
                      size={16}
                      color={item.textColor || '#374151'}
                    />
                  )}
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={Colors.grayColor}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
        onRemove={userImage ? onRemoveImage : null}
      />

      <ImagePreviewModal
        image={previewImage}
        visibility={imageModalVisible}
        setVisibility={setImageModalVisible}
      />

      {showLogoutAlert && (
        <WarningWithButton
          onYes={handleLogout}
          message="Are you sure you want to logout?"
          buttonText="Logout"
          onClose={() => setShowLogoutAlert(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  overlayCircle: {
    position: 'absolute',
    backgroundColor: '#6ce2723c',
    borderRadius: 1000,
  },
  circle1: {
    width: 256,
    height: 256,
    top: -128,
    right: -128,
  },
  circle2: {
    width: 192,
    height: 192,
    bottom: -96,
    right: -96,
    backgroundColor: '#6ce2723c',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 86,
    height: 86,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: Colors.whiteColor,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  nameContainer: {
    marginBottom: 8,
  },
  nameDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  editNameButton: {
    padding: 4,
  },
  editNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    color: Colors.whiteColor,
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  editButtons: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobNumber: {
    color: Colors.whiteColor,
    fontSize: 14,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    marginTop: -32,
  },
  navigationCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  navCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navTitle: {
    color: Colors.blackColor,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
  menuSection: {
    gap: 10,
  },
  menuItem: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000000cf',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: screenWidth * 0.1,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    color: Colors.blackColor,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProfileScreen;

import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import {
  Colors,
  Fonts,
  Sizes,
  commonStyles,
  screenWidth,
} from '../../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MyStatusBar from '../../components/MyStatusBar';
import ImagePreviewModal from '../../components/ImagePreviewModal';

const image =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGdpcmx8ZW58MHx8MHx8fDA%3D';
const ProfileScreen = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [showLogoutSheet, setshowLogoutSheet] = useState(false);
  const [avatar, setAvatar] = useState(image);
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <MyStatusBar />
      <ScrollView style={{ flex: 1 }}>
           <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 50,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 2.0,
          }}
        >
          {profileInfoWithOptions()}
        </ScrollView>
      </ScrollView>
      {logoutSheet()}
       {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          visibility={fullImageModalVisible}
          setVisibility={setFullImageModalVisible}
        />
      )}
    </View>
  );

  function profileInfoWithOptions() {
    return (
      <View style={styles.profileInfoWithOptionsWrapStyle}>
        <TouchableOpacity
          onPress={() => {
            setPreviewImage(image);
            setFullImageModalVisible(true);
          }}
          style={{ alignItems: 'center' }}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.userImageStyle} />
          ) : (
            <View style={styles.userIconStyle}>
              <Icon name="person-off" size={60} color="#e0e0eb" />
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'center',
            marginTop: Sizes.fixPadding,
            marginBottom: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor18SemiBold }}>Alok Singh</Text>
          <Text style={{ ...Fonts.grayColor16Medium }}>+91 985678876</Text>
        </View>
        <View>
          {profileOption({
            option: 'Edit Profile',
            iconName: 'person',
            onPress: () => navigation.navigate('editProfileScreen'),
          })}

          {profileOption({
            option: 'Terms & Conditions',
            iconName: 'list-alt',
            onPress: () => navigation.navigate('editProfileScreen'),
          })}

          {profileOption({
            option: 'Privacy Policy',
            iconName: 'privacy-tip',
            onPress: () => navigation.navigate('editProfileScreen'),
          })}
          {profileOption({
            option: 'Raised Tickets',
            iconName: 'confirmation-number',
            onPress: () => navigation.navigate('editProfileScreen'),
          })}

          {logoutInfo()}
        </View>
      
      </View>
    );
  }

  function logoutInfo() {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setshowLogoutSheet(true);
        }}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons name="logout" size={24} color={Colors.redColor} />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.redColor18Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            Logout
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.redColor}
        />
      </TouchableOpacity>
    );
  }

  function profileOption({ option, iconName, onPress }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          ...commonStyles.rowSpaceBetween,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        <View style={{ ...commonStyles.rowAlignCenter, flex: 1 }}>
          <View style={styles.optionIconWrapper}>
            <MaterialIcons name={iconName} size={24} color={Colors.primary} />
          </View>
          <Text
            numberOfLines={1}
            style={{
              ...Fonts.blackColor14Medium,
              marginLeft: Sizes.fixPadding * 1.5,
              flex: 1,
            }}
          >
            {option}
          </Text>
        </View>
        <MaterialIcons
          name="arrow-forward-ios"
          size={15.0}
          color={Colors.primary}
        />
      </TouchableOpacity>
    );
  }

  function logoutSheet() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLogoutSheet}
        onRequestClose={() => setshowLogoutSheet(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: Colors.bodyBackColor,
              borderTopLeftRadius: Sizes.fixPadding * 3.0,
              borderTopRightRadius: Sizes.fixPadding * 3.0,
              paddingTop: Sizes.fixPadding * 2,
            }}
          >
            {/* <Text style={styles.logoutTextStyle}>Logout</Text> */}
            <Text
              style={{
                textAlign: 'center',
                ...Fonts.blackColor14Medium,
                marginBottom: Sizes.fixPadding * 4,
                marginHorizontal: Sizes.fixPadding * 2.0,
              }}
            >
              Are you sure you want to log out?
            </Text>
            <View
              style={{
                ...commonStyles.rowAlignCenter,
                marginTop: Sizes.fixPadding,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setshowLogoutSheet(false)}
                style={{
                  ...styles.cancelButtonStyle,
                  ...styles.sheetButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.blackColor14Medium }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setshowLogoutSheet(false);
                  console.log(
                    'User logged out successfully in profileScreen and navigating to Signin',
                  );
                }}
                style={{
                  ...styles.logoutButtonStyle,
                  ...styles.sheetButtonStyle,
                }}
              >
                <Text style={{ ...Fonts.whiteColor14Medium }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
};

export default ProfileScreen;

const styles = StyleSheet.create({
  userImageStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 2.0,
  },
  userIconStyle: {
    width: screenWidth / 4.0,
    height: screenWidth / 4.0,
    borderRadius: screenWidth / 4.0 / 2.0,
    marginTop: -Sizes.fixPadding * 5.0,
    borderColor: Colors.extraLightGrayColor,
    borderWidth: 2.0,
    backgroundColor: Colors.whiteColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfoWithOptionsWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    ...commonStyles.shadow,
    borderRadius: Sizes.fixPadding * 2.0,
    marginTop: Sizes.fixPadding * 5.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  optionIconWrapper: {
    width: 46.0,
    height: 46.0,
    borderRadius: 23.0,
    backgroundColor: 'rgba(87, 88, 88, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetButtonStyle: {
    flex: 1,
    ...commonStyles.shadow,
    borderTopWidth: Platform.OS == 'ios' ? 0 : 1.0,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical:
      Platform.OS == 'ios' ? Sizes.fixPadding + 3.0 : Sizes.fixPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopColor: Colors.extraLightGrayColor,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
  logoutButtonStyle: {
    borderTopColor: Colors.primary,
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Sizes.fixPadding - 5.0,
  },
});

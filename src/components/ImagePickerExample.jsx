import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import EditableImagePicker from './EditableImagePicker';
import { Colors } from '../styles/commonStyles';

const ImagePickerExample = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [adImage, setAdImage] = useState(null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile Image</Text>
      <EditableImagePicker
        imageUri={profileImage?.uri}
        onImageChange={setProfileImage}
        placeholder="Add profile photo"
        style={styles.profilePicker}
        imageStyle={styles.profileImage}
      />

      <Text style={styles.title}>Advertisement Image</Text>
      <EditableImagePicker
        imageUri={adImage?.uri}
        onImageChange={setAdImage}
        placeholder="Add advertisement image"
        style={styles.adPicker}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.whiteColor,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.blackColor,
    marginBottom: 10,
    marginTop: 20,
  },
  profilePicker: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  adPicker: {
    marginBottom: 20,
  },
});

export default ImagePickerExample;
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { Colors } from '../styles/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useImagePicker } from './useImagePicker';
import ImageCropPicker from 'react-native-image-crop-picker';

const EditableImagePicker = ({ 
  imageUri, 
  onImageChange, 
  placeholder = "Tap to add image",
  style,
  imageStyle,
  showEditIcon = true 
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { openCamera, openGallery } = useImagePicker();

  const showImageOptions = () => {
    setModalVisible(true);
  };

  const handleCamera = async () => {
    setModalVisible(false);
    try {
      const result = await openCamera();
      if (result) {
        onImageChange(result);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open camera');
    }
  };

  const handleGallery = async () => {
    setModalVisible(false);
    try {
      const result = await openGallery();
      if (result) {
        onImageChange(result);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open gallery');
    }
  };

  const handleCrop = async () => {
    setModalVisible(false);
    try {
      const cropped = await ImageCropPicker.openCropper({
        path: imageUri,
        cropping: true,
        freeStyleCropEnabled: true,
        includeBase64: false,
        cropperToolbarTitle: 'Edit Image',
      });
      
      onImageChange({
        uri: cropped.path,
        fileName: cropped.filename || 'cropped_image.jpg',
        type: cropped.mime,
      });
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Failed to crop image');
      }
    }
  };

  const removeImage = () => {
    setModalVisible(false);
    onImageChange(null);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={showImageOptions}
        activeOpacity={0.8}
      >
        {imageUri ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={[styles.image, imageStyle]}
              resizeMode="cover"
            />
            {showEditIcon && (
              <View style={styles.editIcon}>
                <MaterialIcons name="edit" size={16} color={Colors.whiteColor} />
              </View>
            )}
          </View>
        ) : (
          <View style={styles.placeholder}>
            <MaterialIcons name="add-a-photo" size={32} color={Colors.grayColor} />
            <Text style={styles.placeholderText}>{placeholder}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image</Text>
            
            <TouchableOpacity style={styles.option} onPress={handleCamera}>
              <MaterialIcons name="camera-alt" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.option} onPress={handleGallery}>
              <MaterialIcons name="photo-library" size={24} color={Colors.primary} />
              <Text style={styles.optionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            {imageUri && (
              <TouchableOpacity style={styles.option} onPress={handleCrop}>
                <MaterialIcons name="crop" size={24} color={Colors.primary} />
                <Text style={styles.optionText}>Crop Image</Text>
              </TouchableOpacity>
            )}
            
            {imageUri && (
              <TouchableOpacity style={styles.option} onPress={removeImage}>
                <MaterialIcons name="delete" size={24} color={Colors.redColor} />
                <Text style={[styles.optionText, { color: Colors.redColor }]}>Remove Image</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  editIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 6,
  },
  placeholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.extraLightGrayColor,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.grayColor,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.blackColor,
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 16,
    color: Colors.blackColor,
    marginLeft: 15,
  },
  cancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: Colors.grayColor,
    fontWeight: '500',
  },
});

export default EditableImagePicker;
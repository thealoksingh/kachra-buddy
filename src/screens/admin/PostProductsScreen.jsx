import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Colors } from '../../styles/commonStyles';
import { createItem } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
  TextArea,
} from '../../components/commonComponents';
import SingleSelectDropdown from '../../components/SingleSelectDropdown';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { LottieAlert } from '../../components/lottie/LottieAlert';

const PostProductsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');
  const [unit, setUnit] = useState('KG');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  
  const unitOptions = ['KG', 'LITRE', 'PIECE', 'BUNDLE', 'BOX', 'PACKET', 'TONNE', 'METRE'];
  const tagOptions = [
    'Plastic', 'Metal', 'Paper', 'Glass', 
    'Rubber', 'E-waste', 'Best-Deals'
  ];
  const [previewImage, setPreviewImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

  const pickImage = async source => {
    try {
      let result = null;

      if (source === 'camera') {
        result = await openCamera();
      } else {
        result = await openGallery();
      }

      console.log('📸 Picker result:', result);

      if (result?.uri) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleCreateItem = async () => {
    if (!name || !rate || !unit || tags.length === 0 || !image) {
      dispatch(showSnackbar({
        message: 'Please fill all required fields including image',
        type: 'error',
        time: 3000
      }));
      return;
    }
    
    setLoading(true);
    try {
      const itemData = {
        name,
        pricePerUnit: parseFloat(rate),
        unit,
        tags: tags.join(','),
        isCountable: unit === 'PIECE'
      };
      
      const result = await dispatch(createItem({ itemData, file: image }));
      
      if (createItem.fulfilled.match(result)) {
        dispatch(showSnackbar({
          message: 'Item created successfully',
          type: 'success',
          time: 3000
        }));
        navigation.goBack();
      } else {
        dispatch(showSnackbar({
          message: 'Failed to create item',
          type: 'error',
          time: 3000
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({
        message: 'Failed to create item',
        type: 'error',
        time: 3000
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Post a New Item" />

      <View style={{ flex: 1, marginBottom: 20, marginHorizontal: 10 }}>
        <View style={styles.formCard}>
          <InputBox
            value={name}
            setter={setName}
            placeholder={'Enter Item Name'}
            label={'Item Name'}
            optional={false}
            type={'default'}
          />
          <SingleSelectDropdown
            label="Unit"
            placeholder="Select unit for this item"
            options={unitOptions}
            selectedValue={unit}
            onSelectionChange={setUnit}
            optional={false}
          />
          <InputBox
            value={rate}
            setter={setRate}
            placeholder={`Enter Rate per ${unit?.toLowerCase() || 'unit'}`}
            label={`Rate per ${unit?.toLowerCase() || 'unit'}`}
            optional={false}
            type={'phone-pad'}
          />
          <MultiSelectDropdown
            label="Tags"
            placeholder="Select tags for this item"
            options={tagOptions}
            selectedValues={tags}
            onSelectionChange={setTags}
            optional={false}
          />
          <Text style={styles.sectionLabel}>
            Upload Image{' '}
            <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <View style={styles.imageRow}>
            {image ? (
              <View style={styles.imageBox}>
                <TouchableOpacity
                  onPress={() => {
                    setPreviewImage(image);
                    setFullImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri: image }} style={styles.image} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={removeImage}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.imageBox, styles.addBox]}
                onPress={() => setPickerSheetVisible(true)}
              >
                <Text style={styles.addText}>＋</Text>
              </TouchableOpacity>
            )}
          </View>


        </View>

        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          <ButtonWithLoader
            name="Submit"
            loadingName="Processing..."
            isLoading={loading}
            method={handleCreateItem}
          />
        </View>
      </View>

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          visibility={fullImageModalVisible}
          setVisibility={setFullImageModalVisible}
        />
      )}

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
      {succesAlertVisible && (
        <LottieAlert
          type="success"
          message="Order Cancelled Successfuly"
          loop={false}
          onClose={() => {
            setSuccessAlertVisible(false);
          }}
          autoClose={true}
        />
      )}
      {failureAlertVisible && (
        <LottieAlert
          type="failure"
          message="Order Cancellation Failed ,Try Again "
          loop={false}
          onClose={() => {
            setFailureAlertVisible(false);
          }}
          autoClose={true}
        />
      )}
    </View>
  );
};

export default PostProductsScreen;
const styles = StyleSheet.create({
  formCard: {
    margin: 12,
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
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
    backgroundColor: 'lightgray',
    overflow: 'hidden',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    padding: 6,
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addBox: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 12,
  },
  addText: {
    fontSize: 30,
    color: Colors.primary,
    fontWeight: 'bold',
  },

});

import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Colors } from '../../styles/commonStyles';
import { updateItem } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { showLottieAlert } from '../../store/slices/lottieAlertSlice';
import { deleteItem } from '../../store/thunks/adminThunk';
import {
  ButtonWithLoader,
  CommonAppBar,
  InputBox,
  TextArea,
} from '../../components/commonComponents';
import ImagePreviewModal from '../../components/ImagePreviewModal';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import { LottieAlert } from '../../components/lottie/LottieAlert';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/selector';
import Key from '../../constants/key';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import SingleSelectDropdown from '../../components/SingleSelectDropdown';
import { WarningWithButton } from '../../components/lottie/WarningWithButton';

const UpdateProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const item = route?.params?.item || {};
  console.log('item in update product screen', item);
  const user = useSelector(selectUser);
  const { API_BASE_URL } = Key;
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [name, setName] = useState(item?.name || '');
  const [rate, setRate] = useState(item?.pricePerUnit?.toString() || '');
  const [unit, setUnit] = useState(item?.unit || 'KG');
  const [tags, setTags] = useState(
    item?.tags ? item.tags.split(',').map(tag => tag.trim()) : [],
  );
  console.log('item = ', tags);

  const unitOptions = [
    'KG',
    'LITRE',
    'PIECE',
    'BUNDLE',
    'BOX',
    'PACKET',
    'TONNE',
    'METRE',
  ];
  const tagOptions = [
    'Plastic',
    'Metal',
    'Paper',
    'Glass',
    'Rubber',
    'E-waste',
    'Best-Deals',
  ];
  const [image, setImage] = useState(null);
  const [showServerImage, setShowServerImage] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
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
    console.log('Removing image');
    setImage(null);
    setShowServerImage(false);
  };

  const handleImagePreview = () => {
    if (image) {
      // Show local selected image
      setPreviewImage(image);
    } else if (item?.imageUrl && showServerImage) {
      // Show server image with full URL
      setPreviewImage(API_BASE_URL + item?.imageUrl);
    }
    setFullImageModalVisible(true);
  };

  const handleUpdateItem = async () => {
    console.log('Updating item');

    // Validation: Check if image exists (either local or server)
    const hasImage = image || (item?.imageUrl && showServerImage);

    if (!name || !rate || !unit || tags.length === 0 || !hasImage) {
      dispatch(
        showSnackbar({
          message: 'Please fill all required fields including image',
          type: 'error',
          time: 3000,
        }),
      );
      return;
    }

    setLoadingUpdate(true);
    try {
      const itemData = {
        name,
        pricePerUnit: parseFloat(rate),
        unit,
        tags: tags.join(','),
        isCountable: unit === 'PIECE',
      };
      console.log('item data in update product screen', itemData);

      // Only send file if new image is selected
      const file = image ? image : null;
      console.log('Image file to upload:', file);

      const result = await dispatch(
        updateItem({ itemId: item.id, itemData, file }),
      );

      if (updateItem.fulfilled.match(result)) {
        // Reset image states after successful update
        setImage(null);
        setShowServerImage(true);

        dispatch(
          showLottieAlert({
            message: 'Item updated successfully',
            type: 'success',
            autoClose: true,
          }),
        );
        navigation.goBack();
      } else {
        dispatch(
          showLottieAlert({
            message: 'Failed to update item',
            type: 'failure',
            autoClose: true,
          }),
        );
      }
    } catch (error) {
      dispatch(
        showLottieAlert({
          message: 'Failed to update item',
          type: 'failure',
          autoClose: true,
        }),
      );
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleDeleteItem = async () => {
    setLoadingDelete(true);
    try {
      const result = await dispatch(deleteItem({ itemId: item.id }));

      if (deleteItem.fulfilled.match(result)) {
        dispatch(
          showLottieAlert({
            message: 'Item deleted successfully',
            type: 'success',
            autoClose: true,
          }),
        );
        navigation.goBack();
      } else {
        dispatch(
          showLottieAlert({
            message: 'Failed to delete item',
            type: 'failure',
            autoClose: true,
          }),
        );
      }
    } catch (error) {
      dispatch(
        showLottieAlert({
          message: 'Failed to delete item',
          type: 'failure',
          autoClose: true,
        }),
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Update Item" />

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
            Upload Image <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <View style={styles.imageRow}>
            {image || (item?.imageUrl && showServerImage) ? (
              <View style={styles.imageBox}>
                <TouchableOpacity onPress={handleImagePreview}>
                  <Image
                    source={{
                      uri: image || API_BASE_URL + item?.imageUrl,
                      headers:
                        !image && item?.imageUrl
                          ? { Authorization: `Bearer ${user?.accessToken}` }
                          : undefined,
                    }}
                    style={styles.image}
                  />
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

        <View
          style={{
            marginHorizontal: 10,
            marginVertical: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
           <View style={{ flex: 1 }}>
            <ButtonWithLoader
              name="Delete"
              loadingName="Deleting..."
              isLoading={loadingDelete}
              color={Colors.secondary}
              method={() => setShowDeleteAlert(true)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <ButtonWithLoader
              name="Update"
              loadingName="Updating..."
              isLoading={loadingUpdate}
              method={handleUpdateItem}
            />
          </View>
        </View>
      </View>

      {previewImage && (
        <ImagePreviewModal
          image={previewImage}
          visibility={fullImageModalVisible}
          setVisibility={() => {
            setFullImageModalVisible(false);
            setPreviewImage(null);
          }}
        />
      )}

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />

      {showDeleteAlert && (
        <WarningWithButton
          onYes={handleDeleteItem}
          message="Are you sure you want to Delete?"
          buttonText="Delete"
          onClose={() => setShowDeleteAlert(false)}
        />
      )}
    </View>
  );
};

export default UpdateProductScreen;
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
  typeSelector: {
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
    borderColor: Colors.lightGrayColor,
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
});

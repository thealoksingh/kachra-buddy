import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Colors, commonStyles } from '../../styles/commonStyles';
import MyStatusBar from '../../components/MyStatusBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CommonAppBar, InputBox, ButtonWithLoader } from '../../components/commonComponents';
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateAdvertisement } from '../../store/thunks/adminThunk';
import { showSnackbar } from '../../store/slices/snackbarSlice';
import { useImagePicker } from '../../components/useImagePicker';
import ImagePickerSheet from '../../components/ImagePickerSheet';
import Key from '../../constants/key';

const AdvertisementDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { API_BASE_URL } = Key;
  const advertisement = route.params?.advertisement || {};
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(advertisement.title || '');
  const [description, setDescription] = useState(advertisement.description || '');
  const [redirectUrl, setRedirectUrl] = useState(advertisement.redirectUrl || '');
  const [adSize, setAdSize] = useState(advertisement.adSize || 'SMALL');
  const [displayOrder, setDisplayOrder] = useState(advertisement.displayOrder?.toString() || '');
  const [status, setStatus] = useState(advertisement.status || 'ACTIVE');
  const [currentImage, setCurrentImage] = useState(null);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

   const pickImage = async source => {
    try {
      let result = null;
      const aspectRatio = adSize === 'SMALL' ? '3.33:1' : '1.67:1';
      const quality = 1;
      
      if (source === 'camera') result = await openCamera(aspectRatio, quality);
      else result = await openGallery(aspectRatio, quality);

      if (result?.uri) {
        setCurrentImage(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !description) {
      dispatch(showSnackbar({
        message: 'Please fill all required fields',
        type: 'error',
        time: 3000
      }));
      return;
    }

    setLoading(true);
    try {
      const advertisementData = {
        title,
        description,
        redirectUrl,
        status,
        adSize,
        displayOrder: displayOrder ? parseInt(displayOrder) : advertisement.displayOrder
      };

      const result = await dispatch(updateAdvertisement({ 
        advertisementId: advertisement.id, 
        advertisementData, 
        file: currentImage 
      }));
      
      if (updateAdvertisement.fulfilled.match(result)) {
        dispatch(showSnackbar({
          message: 'Advertisement updated successfully',
          type: 'success',
          time: 3000
        }));
        setIsEditing(false);
        setCurrentImage(null);
      } else {
        dispatch(showSnackbar({
          message: 'Failed to update advertisement',
          type: 'error',
          time: 3000
        }));
      }
    } catch (error) {
      dispatch(showSnackbar({
        message: 'Failed to update advertisement',
        type: 'error',
        time: 3000
      }));
    } finally {
      setLoading(false);
    }
  };

  const imageUri = currentImage || (advertisement.imageUrl ? API_BASE_URL + advertisement.imageUrl : null);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <MyStatusBar />
      <CommonAppBar 
        navigation={navigation} 
        label={isEditing ? "Edit Advertisement" : "Advertisement Details"}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.adImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <Icon name="image" size={60} color={Colors.grayColor} />
            </View>
          )}
          {isEditing && (
            <TouchableOpacity
              style={styles.editImageButton}
              onPress={() => setPickerSheetVisible(true)}
            >
              <Icon name="edit" size={20} color={Colors.whiteColor} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentContainer}>
          {isEditing ? (
            <>
              <InputBox
                value={title}
                setter={setTitle}
                placeholder="Enter Ad Title"
                label="Title"
              />
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description</Text>
                <InputBox
                  value={description}
                  setter={setDescription}
                  placeholder="Enter Ad Description"
                  multiline={true}
                />
              </View>

              <InputBox
                value={redirectUrl}
                setter={setRedirectUrl}
                placeholder="Enter Redirect URL"
                label="Redirect URL"
              />

              <View style={styles.sizeSelector}>
                <Text style={styles.label}>Ad Size</Text>
                <View style={styles.sizeButtons}>
                  <TouchableOpacity
                    style={[styles.sizeButton, adSize === 'SMALL' && styles.selectedSize]}
                    onPress={() => setAdSize('SMALL')}
                  >
                    <Text style={[styles.sizeText, adSize === 'SMALL' && styles.selectedSizeText]}>
                      Small
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sizeButton, adSize === 'LARGE' && styles.selectedSize]}
                    onPress={() => setAdSize('LARGE')}
                  >
                    <Text style={[styles.sizeText, adSize === 'LARGE' && styles.selectedSizeText]}>
                      Large
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.statusSelector}>
                <Text style={styles.label}>Status</Text>
                <View style={styles.statusButtons}>
                  <TouchableOpacity
                    style={[styles.statusButton, status === 'ACTIVE' && styles.selectedStatus]}
                    onPress={() => setStatus('ACTIVE')}
                  >
                    <Text style={[styles.statusText, status === 'ACTIVE' && styles.selectedStatusText]}>
                      Active
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.statusButton, status === 'INACTIVE' && styles.selectedStatus]}
                    onPress={() => setStatus('INACTIVE')}
                  >
                    <Text style={[styles.statusText, status === 'INACTIVE' && styles.selectedStatusText]}>
                      Inactive
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <InputBox
                value={displayOrder}
                setter={setDisplayOrder}
                placeholder="Enter Display Order"
                label="Display Order"
                type="numeric"
              />
            </>
          ) : (
            <>
              <Text style={styles.title}>{advertisement.title}</Text>
              <Text style={styles.description}>{advertisement.description}</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <View style={[styles.statusBadge, { 
                  backgroundColor: advertisement.status === 'ACTIVE' ? Colors.lightPrimary : Colors.extraLightGrayColor 
                }]}>
                  <Text style={[styles.badgeText, { 
                    color: advertisement.status === 'ACTIVE' ? Colors.primary : Colors.grayColor 
                  }]}>
                    {advertisement.status}
                  </Text>
                </View>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Size:</Text>
                <Text style={styles.detailValue}>{advertisement.adSize}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Display Order:</Text>
                <Text style={styles.detailValue}>{advertisement.displayOrder || 'N/A'}</Text>
              </View>

              {advertisement.redirectUrl && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Redirect URL:</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>{advertisement.redirectUrl}</Text>
                </View>
              )}

              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Icon name="visibility" size={24} color={Colors.primary} />
                  <Text style={styles.statNumber}>{advertisement.viewCount || 0}</Text>
                  <Text style={styles.statLabel}>Views</Text>
                </View>
                <View style={styles.statCard}>
                  <Icon name="touch-app" size={24} color={Colors.primary} />
                  <Text style={styles.statNumber}>{advertisement.clickCount || 0}</Text>
                  <Text style={styles.statLabel}>Clicks</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        {isEditing ? (
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setIsEditing(false);
                setCurrentImage(null);
                setTitle(advertisement.title || '');
                setDescription(advertisement.description || '');
                setRedirectUrl(advertisement.redirectUrl || '');
                setAdSize(advertisement.adSize || 'SMALL');
                setDisplayOrder(advertisement.displayOrder?.toString() || '');
                setStatus(advertisement.status || 'ACTIVE');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <ButtonWithLoader
              name="Update"
              loadingName="Updating..."
              isLoading={loading}
              method={handleUpdate}
              style={styles.updateButton}
            />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Icon name="edit" size={20} color={Colors.whiteColor} />
            <Text style={styles.editButtonText}>Edit Advertisement</Text>
          </TouchableOpacity>
        )}
      </View>

      <ImagePickerSheet
        visible={pickerSheetVisible}
        onClose={() => setPickerSheetVisible(false)}
        onCamera={() => pickImage('camera')}
        onGallery={() => pickImage('gallery')}
      />
    </KeyboardAvoidingView>
  );
};

export default AdvertisementDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  adImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.extraLightGrayColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.grayColor,
    lineHeight: 24,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.blackColor,
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: Colors.grayColor,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.blackColor,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.grayColor,
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: Colors.primary,
  },
  sizeSelector: {
    marginBottom: 16,
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
    backgroundColor: Colors.whiteColor,
    alignItems: 'center',
  },
  selectedSize: {
    backgroundColor: Colors.lightPrimary,
    borderColor: Colors.primary,
  },
  sizeText: {
    fontSize: 12,
    color: Colors.grayColor,
  },
  selectedSizeText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  statusSelector: {
    marginBottom: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.extraLightGrayColor,
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
  buttonContainer: {
    padding: 20,
    backgroundColor: Colors.whiteColor,
    borderTopWidth: 1,
    borderTopColor: Colors.extraLightGrayColor,
  },
  editButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editButtonText: {
    color: Colors.whiteColor,
    fontSize: 16,
    fontWeight: '600',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.extraLightGrayColor,
  },
  cancelButtonText: {
    color: Colors.grayColor,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    flex: 1,
  },
});
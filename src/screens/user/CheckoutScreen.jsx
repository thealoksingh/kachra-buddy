import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../styles/commonStyles';
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

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [name, setName] = useState(null);
  const [mobNumber, setMobNUmber] = useState(null);
  const [address, setAddress] = useState(null);
  const [coordinate, setCoordinate] = useState(null);
  const [images, setImages] = useState([]);
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
        if (images.length >= 3) return;
        setImages([...images, result.uri]);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const removeImage = index => {
    try {
      const updated = [...images];
      updated.splice(index, 1);
      setImages(updated);
    } catch (error) {
      console.log('Error removing image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <CommonAppBar navigation={navigation} label="Checkout" />

      <View style={{ flex: 1, marginBottom: 20, marginHorizontal: 10 }}>
        <View style={styles.formCard}>
          <InputBox
            value={name}
            setter={setName}
            placeholder={'Enter Your Name'}
            label={'Name'}
            optional={false}
            type={'default'}
          />
          <InputBox
            value={mobNumber}
            setter={setMobNUmber}
            placeholder={'Enter Mobile Number'}
            label={'Mobile'}
            optional={false}
            type={'phone-pad'}
          />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('locationPickerScreen', {
                onLocationSelected: (address, coordinate) => {
                  setAddress(address);
                  setCoordinate(coordinate);
                },
              })
            }
            style={{
              borderColor: Colors.secondary,
              borderWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 6,
              backgroundColor: Colors.whiteColor,
              marginVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: Colors.secondary, fontWeight: '600' }}>
              Pick Location
            </Text>
          </TouchableOpacity>

          <TextArea
            value={address}
            setter={setAddress}
            placeholder={'Enter Address'}
            label={'Address'}
            optional={false}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>
            Upload Images (Max 3){' '}
            <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <View style={styles.imageRow}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageBox}>
                <TouchableOpacity
                  onPress={() => {
                    setPreviewImage(uri);
                    setFullImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri }} style={styles.image} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 3 && (
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
            method={() => {
              setLoading(true);
              setTimeout(() => {
                setLoading(false);
                navigation.navigate('checkoutScreen');
              }, 500);
            }}
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

export default CheckoutScreen;
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

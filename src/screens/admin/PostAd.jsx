import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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

const PostAd = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [failureAlertVisible, setFailureAlertVisible] = useState(false);
  const [succesAlertVisible, setSuccessAlertVisible] = useState(false);
  const [adSize, setAdSize] = useState('small');
  const [adCards, setAdCards] = useState([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentImage, setCurrentImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fullImageModalVisible, setFullImageModalVisible] = useState(false);
  const [pickerSheetVisible, setPickerSheetVisible] = useState(false);

  const { openCamera, openGallery } = useImagePicker();

  const pickImage = async source => {
    try {
      let result = null;
      if (source === 'camera') result = await openCamera();
      else result = await openGallery();

      if (result?.uri) {
        setCurrentImage(result.uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setPickerSheetVisible(false);
    }
  };

  const addCard = () => {
    if (!currentTitle || !currentImage) return;
    
    const newCard = { title: currentTitle, url: currentImage };
    setAdCards([...adCards, newCard]);
    
    setCurrentTitle('');
    setCurrentImage(null);
  };

  const removeCard = (index) => {
    const updated = adCards.filter((_, i) => i !== index);
    setAdCards(updated);
  };

  const handleSubmit = () => {
    setLoading(true);
    const adData = {
      type: adSize,
      cards: adCards
    };
    console.log('Posting Ad:', adData);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: Colors.whiteColor }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <CommonAppBar navigation={navigation} label="Post a New Advertisement" />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formCard}>
          <View style={styles.sizeSelector}>
            <Text style={styles.sectionLabel}>
              Ad Size
              <Text style={{ color: Colors.secondary }}>*</Text>
            </Text>
            <View style={styles.sizeButtons}>
              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  adSize === 'small' && styles.selectedSize,
                ]}
                onPress={() => setAdSize('small')}
               >
                <Text
                  style={[
                    styles.sizeText,
                    adSize === 'small' && styles.selectedSizeText,
                  ]}
                >
                  Small
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sizeButton,
                  adSize === 'big' && styles.selectedSize,
                ]}
                onPress={() => setAdSize('big')}
              >
                <Text
                  style={[
                    styles.sizeText,
                    adSize === 'big' && styles.selectedSizeText,
                  ]}
                >
                  Big
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <InputBox
            value={currentTitle}
            setter={setCurrentTitle}
            placeholder={'Enter Ad Title'}
            label={'Ad Title'}
            optional={false}
            type={'default'}
          />

          <Text style={styles.sectionLabel}>
            Upload Image <Text style={{ color: Colors.secondary }}>*</Text>
          </Text>
          <View style={styles.imageRow}>
            {currentImage ? (
              <View style={styles.imageBox}>
                <TouchableOpacity
                  onPress={() => {
                    setPreviewImage(currentImage);
                    setFullImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri: currentImage }} style={styles.image} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => setCurrentImage(null)}
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

          <TouchableOpacity style={styles.addCardButton} onPress={addCard}>
            <Text style={styles.addCardText}>Add</Text>
          </TouchableOpacity>
       
        </View>
         {adCards.length > 0 && (<View style={styles.formCard}>
            {adCards.map((card, index) => (
              <View key={index} style={styles.cardItem}>
                <Image
                  source={{ uri: card.url }}
                  style={styles.cardImage}
                />
                <Text style={styles.cardTitle}>{card.title}</Text>
                <TouchableOpacity
                  style={styles.removeCardBtn}
                  onPress={() => removeCard(index)}
                >
                  <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>)}
        <View style={{ marginHorizontal: 10, marginVertical: 10 }}>
          <ButtonWithLoader
            name="Post Ad"
            loadingName="Processing..."
            isLoading={loading}
            method={handleSubmit}
          />
        </View>
      </ScrollView>

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
    </KeyboardAvoidingView>
  );
};

export default PostAd;
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
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
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
    borderColor: Colors.lightGrayColor,
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
  addCardButton: {
    borderColor: Colors.darkBlue,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  addCardText: {
    color: Colors.darkBlue,
    fontSize: 14,
    fontWeight: '500',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.extraLightGrayColor,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    color: Colors.blackColor,
  },
  removeCardBtn: {
    height: 30,
    width: 30,
    borderColor: Colors.secondary,
    borderWidth: 1,
    borderRadius: 15,
    padding: 6,
  },
});

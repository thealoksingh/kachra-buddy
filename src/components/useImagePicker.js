import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import { PermissionsAndroid, Platform } from 'react-native';

export const useImagePicker = () => {
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs access to your camera',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS auto-handles
  };

  const pickAndEdit = async (source = 'gallery', ratio = null, quality = 0.6) => {
    try {
      let result;

      if (source === 'camera') {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) throw new Error('Camera permission denied');

        result = await launchCamera({ mediaType: 'photo', quality });
      } else {
        // Use Android Photo Picker (no permission needed)
        result = await launchImageLibrary({ 
          mediaType: 'photo', 
          quality,
          selectionLimit: 1,
          presentationStyle: 'pageSheet' // Uses system photo picker
        });
      }

      if (result.didCancel) return null;
      if (result.errorCode) throw new Error(result.errorMessage);

      const asset = result.assets?.[0];
      if (!asset) return null;

      const cropOptions = {
        path: asset.uri,
        cropping: true,
        includeBase64: false,
        compressImageQuality: quality,
      };

      if (ratio) {
        const [w, h] = ratio.split(':').map(Number);
        cropOptions.width = w * 500;
        cropOptions.height = h * 500;
        cropOptions.freeStyleCropEnabled = false;
      } else {
        cropOptions.freeStyleCropEnabled = true;
      }

      const cropped = await ImageCropPicker.openCropper(cropOptions);

      return {
        uri: cropped.path,
        fileName: cropped.filename || asset.fileName,
        type: asset.type,
      };
    } catch (err) {
      throw err;
    }
  };

  return {
    openCamera: (ratio, quality) => pickAndEdit('camera', ratio, quality),
    openGallery: (ratio, quality) => pickAndEdit('gallery', ratio, quality),
  };
};

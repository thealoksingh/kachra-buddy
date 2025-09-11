import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImageCropPicker from 'react-native-image-crop-picker';

export const useImagePicker = () => {
  const pickAndEdit = async (
    source = 'gallery',
    ratio = null,
    quality = 0.6
  ) => {
    return new Promise((resolve, reject) => {
      const picker = source === 'camera' ? launchCamera : launchImageLibrary;

      picker({ mediaType: 'photo', quality }, async response => {
        if (response.didCancel) return resolve(null);
        if (response.errorCode) return reject(response.errorMessage);

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          try {
            const cropOptions = {
              path: asset.uri,
              cropping: true,
              includeBase64: false,
              compressImageQuality: quality,
            };

            if (ratio) {
              // Example: ratio = "3:4"
              const [w, h] = ratio.split(':').map(Number);
              cropOptions.width = w * 500;  // scale up for better quality
              cropOptions.height = h * 500;
              cropOptions.freeStyleCropEnabled = false; // force ratio
            } else {
              cropOptions.freeStyleCropEnabled = true; // free crop
            }

            const cropped = await ImageCropPicker.openCropper(cropOptions);

            resolve({
              uri: cropped.path,
              fileName: cropped.filename || asset.fileName,
              type: asset.type,
            });
          } catch (err) {
            reject(err);
          }
        } else {
          resolve(null);
        }
      });
    });
  };

  return {
    openCamera: (ratio, quality) => pickAndEdit('camera', ratio, quality),
    openGallery: (ratio, quality) => pickAndEdit('gallery', ratio, quality),
  };
};

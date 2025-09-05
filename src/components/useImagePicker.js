import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export const useImagePicker = () => {
  const openCamera = async () => {
    return new Promise((resolve, reject) => {
      launchCamera({mediaType: 'photo', quality: 0.7}, response => {
        if (response.didCancel) return resolve(null);
        if (response.errorCode) return reject(response.errorMessage);

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          resolve({
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  const openGallery = async () => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({mediaType: 'photo', quality: 0.7}, response => {
        if (response.didCancel) return resolve(null);
        if (response.errorCode) return reject(response.errorMessage);

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          resolve({
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
          });
        } else {
          resolve(null);
        }
      });
    });
  };

  return { openCamera, openGallery };
};


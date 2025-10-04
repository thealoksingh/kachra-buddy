import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_BASE_URL = 'https://api.aigreenfoundation.com';
const API_BASE_URL = 'https://7a93e8f61c8f.ngrok-free.app';
const tncLink = 'https://greenroing.aigreenfoundation.com/terms-of-service';
const privacyPolicyLink = 'https://greenroing.aigreenfoundation.com/privacy-policy';
export const Key = {
    API_BASE_URL,
    tncLink,
    privacyPolicyLink,
    accessToken: AsyncStorage.getItem("access_token"),
    mapApiKey: 'AIzaSyASRGQshp6t0wfi0WA-6MoHQsD0qAfflaM',
    unsplashApiKey: "nsjVrH4CnoI197tnVB1miQ9Q3gkfeaWfYRkm-1cAPR4",
};

export default Key;


import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = 'https://987c07434982.ngrok-free.app';
export const Key = {
    API_BASE_URL,
    accessToken: AsyncStorage.getItem("access_token"),
    mapApiKey: 'AIzaSyASRGQshp6t0wfi0WA-6MoHQsD0qAfflaM',
    unsplashApiKey: "nsjVrH4CnoI197tnVB1miQ9Q3gkfeaWfYRkm-1cAPR4",
};

export default Key;
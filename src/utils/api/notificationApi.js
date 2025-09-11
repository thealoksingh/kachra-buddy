import Key from "../../constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPostRequest } from "../http/post";
import { apiGetRequest } from '../http/get';
import { apiPatchRequest } from '../http/patch';

const { API_BASE_URL } = Key;

export const sendNotificationAPI = async (notificationData) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/notifications`,
    content_type: "application/json",
    data: notificationData,
    accessToken,
  });
};

export const fetchNotificationsAPI = async (userId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/notifications/user/${userId}`,
    accessToken,
  });
};

export const markNotificationAsReadAPI = async (notificationId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPatchRequest({
    apiUrl: `${API_BASE_URL}/api/notifications/${notificationId}/read`,
    accessToken,
  });
};
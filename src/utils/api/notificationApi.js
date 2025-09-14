import Key from "../../constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPostRequest } from "../http/post";
import { apiGetRequest } from '../http/get';
import { apiPatchRequest } from '../http/patch';
import { apiDeleteRequest } from '../http/delete';

const { API_BASE_URL } = Key;

export const sendPersonalizedNotificationAPI = async ({ userId, title, body }) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/push-notifications/send-to-user?userId=${userId}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
    content_type: "application/json",
    accessToken,
  });
};

export const sendGlobalNotificationAPI = async ({ title, body }) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/push-notifications/broadcast?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`,
    content_type: "application/json",
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

export const deleteNotificationAPI = async (notificationId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiDeleteRequest({
    apiUrl: `${API_BASE_URL}/api/notifications/${notificationId}`,
    accessToken,
  });
};

export const registerFCMTokenAPI = async (token) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/push-notifications/register-token`,
    content_type: "application/x-www-form-urlencoded",
    data: `token=${token}&deviceType=ANDROID`,
    accessToken,
  });
};
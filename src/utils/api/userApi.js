import Key from "../../constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPostRequest } from "../http/post";
import { apiGetRequest } from '../http/get';
import { apiPutRequest } from "../http/put";
import { apiDeleteRequest } from "../http/delete";
import { apiPatchRequest } from "../http/patch";

const { API_BASE_URL } = Key;

export const getUserByIdAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/users/${data?.userId}`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

export const completeProfileAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPatchRequest({
    apiUrl: `${API_BASE_URL}/users/${data?.userId}/complete-profile?fullName=${data?.fullName}`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

export const updateUserAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const requestBody = {
    fullName: data.fullName,
    contactNumber: data.contactNumber,
    role: data.role,
    status: data.status
  };
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/users/${data?.userId}`,
    content_type: "application/json",
    data: requestBody,
    accessToken,
  });
};

export const updateProfilePicAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  formData.append('file', {
    uri: data.uri,
    type: data.type || 'image/jpeg',
    name: data.name || 'profile.jpg',
  });
  
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/users/${data?.userId}/profile-picture`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

export const deleteProfilePicAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiDeleteRequest({
    apiUrl: `${API_BASE_URL}/users/${data?.userId}/profile-picture`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};
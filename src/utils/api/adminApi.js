import Key from "../../constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiPostRequest } from "../http/post";
import {apiGetRequest} from '../http/get';
import { apiPutRequest } from "../http/put";
import { apiDeleteRequest } from "../http/delete";
import { apiPatchRequest } from "../http/patch";

const { API_BASE_URL } = Key;


export const updateAdminProfileAPI = async (data) => {
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

export const fetchAllItemsAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/items`,
    accessToken,
  });
};

export const createItemAPI = async (itemData, file) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  
  formData.append('item', JSON.stringify(itemData));
  
  if (file) {
    formData.append('file', {
      uri: file,
      type: 'image/jpeg',
      name: 'item.jpg',
    });
  }
  
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/items`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

export const updateItemAPI = async (itemId, itemData, file) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  
  formData.append('item', JSON.stringify(itemData));
  
  if (file) {
    formData.append('file', {
      uri: file,
      type: 'image/jpeg',
      name: 'item.jpg',
    });
  }
  
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/items/${itemId}`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

export const fetchAllOrdersAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/orders`,
    accessToken,
  });
};

export const fetchAllUsersAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/users`,
    accessToken,
  });
};

export const createUserAPI = async (userData) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/users`,
    content_type: "application/json",
    data: userData,
    accessToken,
  });
};

export const updateUserAPI = async (userId, userData) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/users/${userId}`,
    content_type: "application/json",
    data: userData,
    accessToken,
  });
};

export const assignDriverAPI = async (orderId, driverId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}/assign-driver/${driverId}`,
    content_type: "application/json",
    accessToken,
  });
};

export const createAdvertisementAPI = async (advertisementData, file) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  
  formData.append('advertisement', JSON.stringify(advertisementData));
  
  if (file) {
    formData.append('file', {
      uri: file,
      type: 'image/jpeg',
      name: 'advertisement.jpg',
    });
  }
  
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/advertisements`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

export const fetchAllAdvertisementsAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/advertisements`,
    accessToken,
  });
};

export const updateAdvertisementAPI = async (advertisementId, advertisementData, file) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  
  formData.append('advertisement', JSON.stringify(advertisementData));
  
  if (file) {
    formData.append('file', {
      uri: file,
      type: 'image/jpeg',
      name: 'advertisement.jpg',
    });
  }
  
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/api/advertisements/${advertisementId}`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};


export const fetchAllTicketsAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/support-tickets`,
    accessToken,
  });
};

export const updateTicketAPI = async (ticketId, ticketData) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/api/support-tickets/${ticketId}`,
    content_type: "application/json",
    data: ticketData,
    accessToken,
  });
};
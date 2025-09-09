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

export const fetchItemsAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/items`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for getting user's cart
export const fetchCartAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/cart/my-cart`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for adding item to cart
export const addItemToCartAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/cart/add-item?itemId=${data.itemId}&quantity=${data.quantity}&unit=${data.unit}`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for removing item from cart
export const removeItemFromCartAPI = async (itemId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiDeleteRequest({
    apiUrl: `${API_BASE_URL}/cart/remove-items?itemId=${itemId}`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for checkout cart items
export const checkoutCartAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/cart/checkout-items`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for updating order with images
export const updateOrderAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  
  // Add order JSON
  formData.append('order', JSON.stringify(data.orderData));
  formData.append('postedBy', data.postedBy);
  
  // Add images if any
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append('files', {
        uri: image,
        type: 'image/jpeg',
        name: `order_image_${index}.jpg`,
      });
    });
  }
  
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${data.orderId}`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

// API call for getting all orders
export const fetchOrdersAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/orders`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for getting order by ID
export const getOrderByIdAPI = async (orderId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};
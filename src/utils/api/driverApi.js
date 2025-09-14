import Key from "../../constants/key";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiGetRequest } from '../http/get';
import { apiPostRequest } from '../http/post';
import { apiPutRequest } from '../http/put';
import { apiPatchRequest } from '../http/patch';

const { API_BASE_URL } = Key;

// API call for getting all driver orders
export const fetchDriverOrdersAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/orders`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for getting all orders
export const getAllOrdersAPI = async () => {
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

// API call for sending pickup OTP
export const sendPickupOtpAPI = async (orderId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}/send-pickup-otp`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for updating order with driver data
export const updateDriverOrderAPI = async (data) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  const formData = new FormData();
  console.log('=== DEBUG: Preparing to update order ===');
  console.log('Order Data:', data.orderJson);
  console.log('Posted By:', data.postedBy);
  formData.append('order', JSON.stringify(data.orderJson));
  formData.append('postedBy', data.postedBy);
  formData.append('otp', data.otp);
  
  if (data.images && data.images.length > 0) {
    data.images.forEach((image, index) => {
      formData.append('files', {
        uri: image,
        type: 'image/jpeg',
        name: `pickup_image_${index}.jpg`,
      });
    });
  }
  
  return apiPutRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${data?.orderId}`,
    content_type: "multipart/form-data",
    data: formData,
    accessToken,
  });
};

// API call for marking order as out for pickup
export const outForPickupAPI = async (orderId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPatchRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}/out-for-pickup`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for marking order as out for delivery
export const outForDeliveryAPI = async (orderId) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPatchRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}/out-for-delivery`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for getting all items
export const getAllItemsAPI = async () => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiGetRequest({
    apiUrl: `${API_BASE_URL}/items`,
    content_type: "application/json",
    data: null,
    accessToken,
  });
};

// API call for adding items to order
export const addItemsToOrderAPI = async (orderId, items) => {
  const accessToken = await AsyncStorage.getItem("access_token");
  return apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/orders/${orderId}/items`,
    content_type: "application/json",
    data: { items },
    accessToken,
  });
};
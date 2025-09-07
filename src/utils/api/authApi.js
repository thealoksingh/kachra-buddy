import Key from "../../constants/key";
import { apiGetRequest } from '../http/get';
import { apiPostRequest } from "../http/post";

const { API_BASE_URL } = Key;

export const sendOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/auth/send-otp`,
    content_type: "application/json",
    data: data,
});

//Verify OTP API
export const verifyOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${API_BASE_URL}/api/auth/verify-otp`,
    content_type: "application/json",
    data: data,
});

//Get status of Server

export const pingServerAPI = () =>
  apiGetRequest({
    apiUrl: `${API_BASE_URL}/api/auth/ping`,
    content_type: "application/json",
    data: null,
});
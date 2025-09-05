import Key from "../../constants/key";
import { apiPostRequest } from "../http/post";
import {apiGetRequest} from '../http/get';
import { apiPutRequest } from "../http/put";
import { apiDeleteRequest } from "../http/delete";

const {APP_BACKEND_API} = Key;

export const sendOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${APP_BACKEND_API}/api/auth/send-otp`,
    content_type: "application/json",
    data: data,
});

//Verify OTP API
export const verifyOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${APP_BACKEND_API}/api/auth/verify-otp`,
    content_type: "application/json",
    data: data,
});

//Get status of Server

export const pingServerAPI = () =>
  apiGetRequest({
    apiUrl: `${APP_BACKEND_API}/api/auth/ping`,
    content_type: "application/json",
    data: null,
});
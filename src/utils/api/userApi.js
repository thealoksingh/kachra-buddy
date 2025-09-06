import Key from "../../constants/key";
import { apiPostRequest } from "../http/post";
import {apiGetRequest} from '../http/get';
import { apiPutRequest } from "../http/put";
import { apiDeleteRequest } from "../http/delete";

const {APP_BACKEND_API} = Key;

export const updateUserAPI = (data) =>
  apiPutRequest({
    apiUrl:  `${USER_API_URL}/users/${data?.userId}`,
    content_type: "application/json",
    data: data,
});

export const updateProfilePicAPI = (data) =>
  apiPutRequest({
    apiUrl:  `${USER_API_URL}/users/${data?.userId}/profile-picture`,
    content_type: "application/json",
    data: data,
});

export const deleteProfilePicAPI = (data) =>
  apiDeleteRequest({
    apiUrl:  `${USER_API_URL}/users/${data?.userId}/profile-picture`,
    content_type: "application/json",
    data: data,
});
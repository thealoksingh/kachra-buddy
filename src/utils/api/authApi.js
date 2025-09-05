import Key from "../../constants/key";
import { apiPostRequest } from "../http/post";
import {apiGetRequest} from '../http/get';
import { apiPutRequest } from "../http/put";
import { apiDeleteRequest } from "../http/delete";

const {APP_BACKEND_API} = Key;

export const sendOtpAPI = (data) =>
  apiPostRequest({
    apiUrl: `${APP_BACKEND_API}/auth/....`,
    content_type: "application/json",
    data: data,
});
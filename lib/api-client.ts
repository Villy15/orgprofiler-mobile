import axios from "axios";

export const API_URL =
  process.env.EXPO_PUBLIC__NODE_ENV === "production"
    ? process.env.EXPO_PUBLIC_API_URL_PROD
    : process.env.EXPO_PUBLIC_API_URL_DEV;

export const apiClient = axios.create({
  baseURL: API_URL,
});

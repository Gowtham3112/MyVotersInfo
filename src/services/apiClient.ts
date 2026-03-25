
import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import SERVERURL from "./serviceURL";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: SERVERURL,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("API Request Headers:", config.headers);
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      // window.location.href = "/home";
    }
    return Promise.reject(error);
  }
);

export const apiCall = async <T>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient({ method, url, data, ...config });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) throw error;
    throw error;
  }
};

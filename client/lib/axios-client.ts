import { getAccessToken } from "@/utils/auth-storage";
import axios from "axios";

const axiosClient = axios.create();

axiosClient.defaults.baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;

// Adding Authorization header for all requests
axiosClient.interceptors.request.use(
  (config) => {
    // Get the access token if available
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Determine Content-Type based on the data
    if (config.data) {
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else if (typeof config.data === "object") {
        config.headers["Content-Type"] = "application/json";
      } else if (typeof config.data === "string") {
        // Assuming text/plain for string data, adjust as needed
        config.headers["Content-Type"] = "text/plain";
      }
    }

    return config;
  },
  (error) => {
    console.log({ error });
    return Promise.reject(error);
  }
);

export default axiosClient;

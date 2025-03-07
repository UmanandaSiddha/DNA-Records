import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error(error.response?.data?.message || "Something went wrong!");
        return Promise.reject(error);
    }
);

export default API;
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import useStore from "hostApp/GlobalStore";
import dayjs from 'dayjs'

// Helper function to check if token is expired
const isTokenExpired = (token) => {
    try {
        const user = jwtDecode(token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        return isExpired;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true; // Treat as expired if decoding fails
    }
};

// Custom hook to create axios instance
const useAxiosInstance = () => {
    const { accessToken, refreshToken, setAccessToken, setRefreshToken, logout } = useStore();
    const getAccessToken = () => accessToken;

    const refreshAccessToken = async () => {
        try {
            const response = await axios.post("http://localhost:2000/api/v1/user/auth/refresh-token", {
                refreshToken
            });
            console.log("new tokens set generated");
            const { accessToken, refreshToken: newRefreshToken } = response.data?.data;
            setAccessToken(accessToken);
            setRefreshToken(newRefreshToken);
            return accessToken;
        } catch (error) {
            window.alert("Session expired. Login to continue");
            console.error("Error refreshing tokens");
            logout();
        }
    };

    const axiosInstance = axios.create({
        baseURL: "http://localhost:2000/api/v1/user/profile"
    });

    // Request interceptor to add access token and refresh token logic
    axiosInstance.interceptors.request.use(
        async (config) => {
            let accessToken = getAccessToken();

            // Check if access token is expired
            if (!accessToken || isTokenExpired(accessToken)) {
                try {
                    console.log("access token is expired");
                    accessToken = await refreshAccessToken();
                } catch (error) {
                    console.log("Failed to get refresh token");
                    return Promise.reject(error);
                }
            }

            // Add access token to request header
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            } else {
                console.log("Access token is required");
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    return axiosInstance;
};

export default useAxiosInstance;
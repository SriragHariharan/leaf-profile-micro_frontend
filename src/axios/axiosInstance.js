import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useMemo, useRef } from 'react';
import useStore from "hostApp/GlobalStore";
import dayjs from 'dayjs'
import { LEAF_PROFILE_REFRESH_TOKEN_URL, LEAF_USER_BASE_URL } from '../constants/constants';

const isTokenExpired = (token) => {
    try {
        const user = jwtDecode(token)
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
        return isExpired;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

const useAxiosInstance = () => {
    const store = useStore();
    const storeRef = useRef(store);
    storeRef.current = store;

    return useMemo(() => {
        const refreshPromiseRef = { current: null };

        const refreshAccessToken = async () => {
            if (refreshPromiseRef.current) {
                return refreshPromiseRef.current;
            }

            refreshPromiseRef.current = (async () => {
                const { refreshToken, setAccessToken, setRefreshToken, logout } = storeRef.current;
                try {
                    const response = await axios.post(LEAF_PROFILE_REFRESH_TOKEN_URL, {
                        refreshToken,
                    });
                    const { accessToken, refreshToken: newRefreshToken } = response.data?.data;
                    setAccessToken(accessToken);
                    setRefreshToken(newRefreshToken);
                    return accessToken;
                } catch (error) {
                    window.alert("Session expired. Login to continue");
                    console.error("Error refreshing tokens");
                    logout();
                    throw error;
                } finally {
                    refreshPromiseRef.current = null;
                }
            })();

            return refreshPromiseRef.current;
        };

        const axiosInstance = axios.create({
            baseURL: LEAF_USER_BASE_URL,
        });

        axiosInstance.interceptors.request.use(
            async (config) => {
                let accessToken = storeRef.current.accessToken;

                if (!accessToken || isTokenExpired(accessToken)) {
                    accessToken = await refreshAccessToken();
                }

                if (accessToken) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        return axiosInstance;
    }, []);
};

export default useAxiosInstance;

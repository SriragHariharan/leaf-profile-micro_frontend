/**
 * axios instance to collect access token from globalStore and send to the server
 * so that we can access the protected routes
 */
import axios from 'axios';
import { useEffect } from 'react';
import useStore from "hostApp/GlobalStore";

const useAxiosInstance = () => {
    const { accessToken } = useStore();

    const axiosInstance = axios.create({
        baseURL: "http://localhost:5000/api/v1/user/profile"
    });

    const requestInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }else{
                console.log("Access token is required");
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
    // useEffect(() => {

    //     // Cleanup the interceptor on unmount
    //     return () => {
    //         axiosInstance.interceptors.request.eject(requestInterceptor);
    //     };
    // }, [accessToken]);

    return axiosInstance;
};

export default useAxiosInstance;
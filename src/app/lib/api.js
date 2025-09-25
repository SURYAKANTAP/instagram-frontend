"use client";
import axios from 'axios';


const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    
    withCredentials: true, // This is CRUCIAL for sending HttpOnly cookies
});

// This function will be called by AuthContext to set the token
export const setAuthToken = (token) => {
    if (token) {
        // Apply the authorization token to every request if logged in
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Delete the auth header
        delete api.defaults.headers.common['Authorization'];
    }
};

// NEW: A function to set up the interceptor
export const setupAuthInterceptor = (logoutHandler) => {
    const responseInterceptor = api.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await api.post('/auth/refresh-token');
                    const { accessToken } = response.data;
                    setAuthToken(accessToken);
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, call the handler that was passed in
                    logoutHandler(); 
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );

    // We can return the eject function if we need to clean up later
    return () => {
        api.interceptors.response.eject(responseInterceptor);
    };
};


export default api;
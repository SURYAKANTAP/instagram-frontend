"use client";
import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, {setAuthToken} from '../lib/api'; // Import our configured Axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        // This function runs when the component mounts.
        // It tries to get a new access token using the refresh token cookie.
        // This is how we keep the user logged in across page refreshes.
        const checkAuthStatus = async () => {
            try {
                const response = await api.post('/auth/refresh-token');
                const { accessToken, user } = response.data;
                  setAuthToken(accessToken);
                setUser(user);
            } catch (error) {
                // If refresh-token fails, it means the user is not logged in.
                setUser(null);
                setAuthToken(null);
            } finally {
                // We're done checking, so set loading to false.
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Axios Interceptor to handle expired access tokens
    useEffect(() => {
        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;
                // If the error is 401 and we haven't already retried
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const response = await api.post('/auth/refresh-token');
                        const { accessToken, user } = response.data;
                        setAuthToken(accessToken);
                        setUser(user);
                        // Update the header of the original request with the new token
                        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        // If refresh token is also invalid, logout the user
                        logoutAction();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );

        // Cleanup interceptor on component unmount
        return () => {
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [logoutAction]);

    const signupAction = async (credentials) => {
        // No need for try/catch here, the component will handle it
        const response = await api.post('/auth/signup', credentials);
        return response.data;
    };

    const loginAction = async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, user } = response.data;
        setAuthToken(accessToken);
        setUser(user);
        router.replace('/'); // Redirect home after successful login
    };

    const logoutAction = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed, but clearing client state anyway.", error);
        } finally {
            setUser(null);
            setAuthToken(null);
            router.replace('/login'); // Redirect to login page
        }
    };

    const value = {
        user,
    
        loading,
        signupAction,
        loginAction,
        logoutAction,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
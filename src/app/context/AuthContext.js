"use client";
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, {setAuthToken, setupAuthInterceptor} from '../lib/api'; // Import our configured Axios instance



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

    useEffect(() => {
        // Call the setup function and pass it the logoutAction
        const ejectInterceptor = setupAuthInterceptor(logoutAction);
        
        // Return the cleanup function
        return () => {
            ejectInterceptor();
        };
    }, []); 

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

     const logoutAction = useCallback(async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout failed, but clearing client state anyway.", error);
        } finally {
            setUser(null);
            setAuthToken(null);
            router.replace('/login');
        }
    }, [router]); // Dependency: router

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
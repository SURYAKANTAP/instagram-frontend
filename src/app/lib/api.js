import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8000/api', // Your backend URL
    baseURL: 'https://instagram-backend-9xo7.onrender.com/api',
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

export default api;
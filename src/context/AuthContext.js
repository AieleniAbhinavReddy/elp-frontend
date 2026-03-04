import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiLogin, apiSignUp, apiFetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const response = await apiFetchCurrentUser();
                    setUser(response.data);
                } catch (error) {
                    console.error("Token is invalid, logging out.", error);
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await apiLogin(username, password);
            const { token: newToken, user: userData } = response.data;
            setToken(newToken);
            setUser(userData);
            localStorage.setItem('token', newToken);
            sessionStorage.setItem('token', newToken);
            toast.success('Login successful!');
            return true;
        } catch (error) {
            const errorMsg = error.normalizedError?.message || 
                           error.response?.data?.message || 
                           'Invalid credentials';
            toast.error(errorMsg);
            return false;
        }
    };
    
    const signup = async (userData) => {
        try {
            const response = await apiSignUp(userData);
            // Handle plain text response: "User registered successfully!"
            const message = typeof response.data === 'string' 
                ? response.data 
                : response.data?.message || 'Sign up successful!';
            toast.success(message);
            return true;
        } catch (error) {
            let errorMsg = 'Sign up failed.';
            
            // Handle 409 Conflict (username taken)
            if (error.response?.status === 409) {
                errorMsg = error.normalizedError?.message || 
                          error.response?.data?.error ||
                          'Username is already taken!';
            } else {
                errorMsg = error.normalizedError?.message || 
                          error.response?.data?.message || 
                          errorMsg;
            }
            
            toast.error(errorMsg);
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        toast.success('Logged out successfully');
    };

    const authContextValue = {
        token,
        user,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
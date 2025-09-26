import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiLogin, apiSignUp, apiFetchCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
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
            toast.success('Login successful!');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials');
            return false;
        }
    };
    
    const signup = async (userData) => {
        try {
            await apiSignUp(userData);
            toast.success('Sign up successful! Please log in.');
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Sign up failed. Username might be taken.');
            return false;
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
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
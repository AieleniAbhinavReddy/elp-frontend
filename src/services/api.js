import axios from 'axios';

// 1. Create a central apiClient instance
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080'
});

// 2. This function will be called from our App.js to connect the interceptors to the loader context
export const setupInterceptors = (showLoader, hideLoader) => {
    // This interceptor runs BEFORE each request is sent
    apiClient.interceptors.request.use(config => {
        showLoader(); // Show the loader
        return config;
    }, error => {
        hideLoader(); // Hide loader on request error
        return Promise.reject(error);
    });

    // This interceptor runs AFTER each response is received
    apiClient.interceptors.response.use(response => {
        hideLoader(); // Hide the loader
        return response;
    }, error => {
        hideLoader(); // Hide loader on response error
        return Promise.reject(error);
    });
};

// Helper to get the token.
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- 3. ALL APIS NOW USE the apiClient INSTANCE ---

// --- AUTHENTICATION APIS ---
export const apiLogin = (username, password) => {
    return apiClient.post(`/api/auth/login`, { username, password });
};

export const apiSignUp = (userData) => {
    return apiClient.post(`/api/auth/register`, userData);
};

export const apiFetchCurrentUser = () => {
    return apiClient.get(`/api/auth/me`, { headers: getAuthHeader() });
};

// --- PASSWORD RESET APIS ---
export const apiForgotPassword = (username, securityAnswer) => {
    return apiClient.post(`/api/auth/forgot-password`, { username, securityAnswer });
};

export const apiResetPassword = (token, newPassword) => {
    return apiClient.post(`/api/auth/reset-password`, { token, newPassword });
};

// --- COURSE APIS ---
export const apiGetCourses = () => {
    return apiClient.get(`/api/courses`);
};

export const apiGetCourseDetails = (courseId) => {
    return apiClient.get(`/api/courses/${courseId}`, { headers: getAuthHeader() });
};

export const apiGetMyCourses = () => {
    return apiClient.get(`/api/registrations/my-courses`, { headers: getAuthHeader() });
};

export const apiRegisterForCourse = (courseId) => {
    return apiClient.post(`/api/registrations/register/${courseId}`, {}, { headers: getAuthHeader() });
};

export const apiUnregisterFromCourse = (courseId) => {
    return apiClient.delete(`/api/registrations/unregister/${courseId}`, { headers: getAuthHeader() });
};

// --- CHATBOT APIS ---
export const apiSendChatMessage = (formData) => {
    return apiClient.post(`/chatbot/send`, formData, { headers: getAuthHeader() });
};

// --- COMPILER API ---
export const apiRunCode = (compilerData) => {
    return apiClient.post(`/api/compiler/run`, compilerData);
};
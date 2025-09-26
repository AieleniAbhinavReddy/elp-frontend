import axios from 'axios';

// --- THIS IS THE ONLY LINE THAT CHANGES ---
// It now uses the deployment URL from Vercel, but falls back to localhost for local development.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Helper to get the token. We will use the key 'token'.
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // <-- Use 'token' for consistency
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// --- AUTHENTICATION APIS ---
export const apiLogin = (username, password) => {
    return axios.post(`${API_URL}/api/auth/login`, { username, password });
};

export const apiSignUp = (userData) => {
    return axios.post(`${API_URL}/api/auth/register`, userData);
};

export const apiFetchCurrentUser = () => {
    return axios.get(`${API_URL}/api/auth/me`, { headers: getAuthHeader() });
};

// --- PASSWORD RESET APIS (UPDATED FOR TOKEN FLOW) ---
export const apiForgotPassword = (username, securityAnswer) => {
    // This now calls the correct, secure endpoint.
    return axios.post(`${API_URL}/api/auth/forgot-password`, { username, securityAnswer });
};

export const apiResetPassword = (token, newPassword) => {
    // This now sends the token instead of the username.
    return axios.post(`${API_URL}/api/auth/reset-password`, { token, newPassword });
};

// --- COURSE APIS ---
export const apiGetCourses = () => {
    return axios.get(`${API_URL}/api/courses`);
};

export const apiGetCourseDetails = (courseId) => {
    // No change needed here, getAuthHeader already sends the token
    return axios.get(`${API_URL}/api/courses/${courseId}`, { headers: getAuthHeader() });
};

export const apiGetMyCourses = () => {
    // New function for the My Courses page
    return axios.get(`${API_URL}/api/registrations/my-courses`, { headers: getAuthHeader() });
};

export const apiRegisterForCourse = (courseId) => {
    return axios.post(`${API_URL}/api/registrations/register/${courseId}`, {}, { headers: getAuthHeader() });
};

export const apiUnregisterFromCourse = (courseId) => {
    return axios.delete(`${API_URL}/api/registrations/unregister/${courseId}`, { headers: getAuthHeader() });
};

// --- CHATBOT APIS ---
export const apiSendChatMessage = (formData) => {
    return axios.post(`${API_URL}/chatbot/send`, formData, { headers: getAuthHeader() });
};
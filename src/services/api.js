import axios from 'axios';

const DEFAULT_API_BASE = 'https://elp-backend-production.up.railway.app';
const API_BASE_URL = (process.env.REACT_APP_API_URL || DEFAULT_API_BASE).replace(/\/+$/, '');

// 1. Create a central apiClient instance with baseURL from env or fallback
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getStoredAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to normalize error responses
const normalizeError = (error) => {
    if (error.response) {
        // Server responded with error status
        const status = error.response.status;
        const data = error.response.data;
        
        // Try to extract message from various possible response formats
        let message = '';
        if (typeof data === 'string') {
            message = data;
        } else if (data?.message) {
            message = data.message;
        } else if (data?.error) {
            message = data.error;
        }

        if (!message) {
            if (status === 400) {
                message = 'Invalid request. Please check your input.';
            } else if (status === 401) {
                message = 'Your session has expired. Please login again.';
            } else if (status === 404) {
                message = 'Resource not found.';
            } else if (status === 409) {
                message = 'Conflict detected. Please try a different value.';
            } else if (status >= 500) {
                message = 'Server error, try again later.';
            }
        }
        
        return {
            status,
            message: message || `Error: ${status}`,
            data
        };
    } else if (error.request) {
        // Request made but no response
        return {
            status: 0,
            message: 'Network error, check your connection.',
            data: null
        };
    } else {
        // Error in request setup
        return {
            status: 0,
            message: error.message || 'Unknown error',
            data: null
        };
    }
};

// 2. This function will be called from our App.js to connect the interceptors to the loader context
export const setupInterceptors = (showLoader, hideLoader) => {
    // This interceptor runs BEFORE each request is sent
    apiClient.interceptors.request.use(config => {
        showLoader(); // Show the loader
        // Add token to request headers
        const token = getStoredAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
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
        // Normalize error and attach it
        error.normalizedError = normalizeError(error);

        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.replace('/login');
            }
        }
        return Promise.reject(error);
    });
};

export { apiClient, normalizeError };

// --- 3. ALL APIS NOW USE the apiClient INSTANCE ---

// --- AUTHENTICATION APIS ---
export const apiLogin = (username, password) => {
    return apiClient.post(`/api/auth/login`, { username, password });
};

// SignUp returns plain text response "User registered successfully!"
export const apiSignUp = (userData) => {
    return apiClient.post(`/api/auth/register`, userData);
};

export const apiFetchCurrentUser = () => {
    return apiClient.get(`/api/auth/me`);
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

// Handles the videos parse quirk: videos is a JSON string, not an object
export const apiGetCourseDetails = (courseId) => {
    return apiClient.get(`/api/courses/${courseId}`);
};

export const apiGetMyCourses = () => {
    return apiClient.get(`/api/registrations/my-courses`);
};

// Registrations endpoints - returns plain text response
export const apiRegisterForCourse = (courseId) => {
    return apiClient.post(`/api/registrations/register/${courseId}`, {});
};

export const apiUnregisterFromCourse = (courseId) => {
    return apiClient.delete(`/api/registrations/unregister/${courseId}`);
};

// --- COMPILER API - Backend endpoint ---
// POST /api/compiler/execute
// Supported languages: java, python, javascript, cpp
export const apiExecuteCode = async ({ script, language, versionIndex, stdin }) => {
    return apiClient.post(`/api/compiler/execute`, {
        script,
        language,
        versionIndex: versionIndex !== undefined ? versionIndex : 0,  // Integer, not string
        stdin: stdin || ''
    });
};

// --- CHATBOT API - Direct call to Groq (bypasses backend) ---
// NOTE: We use plain axios.post and not apiClient to bypass base URL and JWT interceptors.
const GROQ_API_URL = process.env.REACT_APP_GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
// Using the model name defined in the React environment
const GROQ_MODEL = process.env.REACT_APP_GROQ_MODEL || "llama3-8b-8192"; 

export const apiSendChatMessage = async (formData) => {
    // Extract the prompt from the FormData object passed from ChatComponent
    const prompt = formData.get("prompt");
    
    if (!GROQ_API_KEY) {
        throw new Error("Groq API Key is missing in environment variables.");
    }

    // Reconstructing the JSON payload expected by Groq (similar to the Java DTOs)
    const payload = {
        model: GROQ_MODEL,
        messages: [
            {
                role: "user",
                content: prompt
            }
        ]
    };

    try {
        const response = await axios.post(
            GROQ_API_URL,
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Logic migrated from GroqController.java: safely extract the content string
        const messageContent = response.data?.choices?.[0]?.message?.content;

        if (messageContent) {
            // Return an object structure that maintains compatibility with ChatComponent's `response.data` expectation
            return { data: messageContent };
        } else {
            return { data: "No content received from the Groq API." };
        }
    } catch (error) {
        console.error("Groq API Call Error:", error);
        throw error;
    }
};

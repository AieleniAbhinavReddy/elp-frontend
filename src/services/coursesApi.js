import { apiClient, getStoredAuthToken } from './api';

const buildAuthHeaders = (token) => {
    const authToken = token || getStoredAuthToken();
    if (!authToken) {
        return {};
    }
    return {
        Authorization: `Bearer ${authToken}`,
    };
};

export const getCourses = async () => {
    const response = await apiClient.get('/api/courses');
    return Array.isArray(response.data) ? response.data : [];
};

export const getCourseDetail = async (courseId) => {
    const response = await apiClient.get(`/api/courses/${courseId}`);
    const payload = response.data || {};
    return {
        ...payload,
        lessons: Array.isArray(payload.lessons) ? payload.lessons : [],
    };
};

export const getLessonDetail = async (courseId, lessonId) => {
    const response = await apiClient.get(`/api/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
};

export const registerCourse = async (courseId, token) => {
    const response = await apiClient.post(
        `/api/registrations/register/${courseId}`,
        {},
        { headers: buildAuthHeaders(token) }
    );
    return response.data;
};

export const unregisterCourse = async (courseId, token) => {
    const response = await apiClient.delete(`/api/registrations/unregister/${courseId}`, {
        headers: buildAuthHeaders(token),
    });
    return response.data;
};

export const getMyCourses = async (token) => {
    const response = await apiClient.get('/api/registrations/my-courses', {
        headers: buildAuthHeaders(token),
    });
    return Array.isArray(response.data) ? response.data : [];
};

export const getCourseProgress = async (courseId, token) => {
    const response = await apiClient.get(`/api/registrations/${courseId}/progress`, {
        headers: buildAuthHeaders(token),
    });
    return response.data;
};

export const markLessonComplete = async (courseId, lessonId, token) => {
    const response = await apiClient.post(
        `/api/registrations/${courseId}/lessons/${lessonId}/complete`,
        {},
        { headers: buildAuthHeaders(token) }
    );
    return response.data;
};

export const unmarkLessonComplete = async (courseId, lessonId, token) => {
    const response = await apiClient.delete(`/api/registrations/${courseId}/lessons/${lessonId}/complete`, {
        headers: buildAuthHeaders(token),
    });
    return response.data;
};

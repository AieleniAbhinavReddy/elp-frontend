import { apiClient, getStoredAuthToken } from './api';

/**
 * Helper: build auth header if token is available
 */
const optionalAuthHeaders = () => {
    const token = getStoredAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const requiredAuthHeaders = () => {
    const token = getStoredAuthToken();
    if (!token) throw new Error('Authentication required');
    return { Authorization: `Bearer ${token}` };
};

// ─── Public (auth optional, enriches response if logged in) ───

export const getDsaSheets = async () => {
    const response = await apiClient.get('/api/dsa/sheets', {
        headers: optionalAuthHeaders()
    });
    return response.data;
};

export const getDsaSheetDetail = async (sheetId) => {
    const response = await apiClient.get(`/api/dsa/sheets/${sheetId}`, {
        headers: optionalAuthHeaders()
    });
    return response.data;
};

// ─── Auth required ───

export const markProblemSolved = async (problemId) => {
    const response = await apiClient.post(`/api/dsa/problems/${problemId}/solve`, {}, {
        headers: requiredAuthHeaders()
    });
    return response.data;
};

export const unmarkProblemSolved = async (problemId) => {
    const response = await apiClient.delete(`/api/dsa/problems/${problemId}/solve`, {
        headers: requiredAuthHeaders()
    });
    return response.data;
};

export const getSheetProgress = async (sheetId) => {
    const response = await apiClient.get(`/api/dsa/sheets/${sheetId}/progress`, {
        headers: requiredAuthHeaders()
    });
    return response.data;
};

export const getMyDsaProgress = async () => {
    const response = await apiClient.get('/api/dsa/my-progress', {
        headers: requiredAuthHeaders()
    });
    return response.data;
};

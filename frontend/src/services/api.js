
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getStatistics = () => apiClient.get('/statistics');
export const getOpportunities = (params) => apiClient.get('/opportunities', { params });
// export const searchOpportunities = (params) => apiClient.get('/search', { params }); // Covered by getOpportunities with params
export const getFilterOptions = () => apiClient.get('/filters');

export default apiClient;

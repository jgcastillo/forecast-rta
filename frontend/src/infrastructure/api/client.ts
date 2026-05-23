import axios from 'axios';
import { UserCreate, UserResponse } from './types';

// Create an Axios instance with base url pointing to proxied backend endpoint
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to dynamically inject the Admin JWT token from local storage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API client module
export const authApi = {
  register: async (payload: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>('/auth/register', payload);
    return response.data;
  },
};

export default apiClient;

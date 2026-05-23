import axios from 'axios';
import { UserCreate, UserResponse, LoginCredentials, TokenResponse } from './types';

// Create an Axios instance with base url pointing to proxied backend endpoint
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
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
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);
    
    const response = await apiClient.post<TokenResponse>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },
};

export default apiClient;

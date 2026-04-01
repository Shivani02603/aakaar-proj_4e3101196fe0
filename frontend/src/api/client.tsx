import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

// Request interceptor: attach JWT if present
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 by clearing token and redirecting to login
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page; adjust path as needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// TypeScript interfaces for auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
}

// TypeScript interfaces for notes
export interface Note {
  id: number;
  title: string;
  content: string;
}

export interface NoteListResponse {
  notes: Note[];
}

export interface DeleteResponse {
  message: string;
}

// Auth API exports
export const login = (data: LoginRequest) => api.post<LoginResponse>('/api/auth/login', data);
export const register = (data: RegisterRequest) => api.post<RegisterResponse>('/api/auth/register', data);

// Notes API exports
export const getNotes = () => api.get<NoteListResponse>('/api/notes');
export const createNote = (data: Omit<Note, 'id'>) => api.post<Note>('/api/notes', data);
export const deleteNote = (id: number) => api.delete<DeleteResponse>(`/api/notes/${id}`);

export default api;
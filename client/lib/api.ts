import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData: any) => api.put('/auth/profile', userData),
  changePassword: (passwordData: any) => api.put('/auth/change-password', passwordData),
};

// Posts API
export const postsAPI = {
  getAllPosts: (params?: any) => api.get('/posts', { params }),
  getPost: (id: string) => api.get(`/posts/${id}`),
  createPost: (postData: any) => api.post('/posts', postData),
  updatePost: (id: string, postData: any) => api.put(`/posts/${id}`, postData),
  deletePost: (id: string) => api.delete(`/posts/${id}`),
  likePost: (id: string) => api.post(`/posts/${id}/like`),
  uploadImage: (formData: FormData) => api.post('/posts/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Comments API
export const commentsAPI = {
  getComments: (postId: string) => api.get(`/posts/${postId}/comments`),
  createComment: (postId: string, commentData: any) => api.post(`/posts/${postId}/comments`, commentData),
  updateComment: (postId: string, commentId: string, commentData: any) => 
    api.put(`/posts/${postId}/comments/${commentId}`, commentData),
  deleteComment: (postId: string, commentId: string) => 
    api.delete(`/posts/${postId}/comments/${commentId}`),
  likeComment: (postId: string, commentId: string) => 
    api.post(`/posts/${postId}/comments/${commentId}/like`),
};

// Users API
export const usersAPI = {
  getUser: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  getUserPosts: (id: string) => api.get(`/users/${id}/posts`),
};

export default api;
import axios from 'axios';
import { getToken, removeToken } from './auth';
import type { Snack, Review, Favorite, Paginated, AuthTokens, User, Category, Brand, BlogPost } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      removeToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// Auth
export const authApi = {
  signup: (data: { email: string; password: string; nickname: string }) =>
    api.post<AuthTokens>('/auth/signup', data).then((r) => r.data),
  login: (data: { email: string; password: string }) =>
    api.post<AuthTokens>('/auth/login', data).then((r) => r.data),
};

// Users
export const usersApi = {
  me: () => api.get<User>('/users/me').then((r) => r.data),
};

// Snacks
export const snacksApi = {
  list: (params?: { page?: number; limit?: number; categoryId?: number; brandId?: number; sort?: string; dateRange?: 'today' | 'week' | 'month' }) =>
    api.get<Paginated<Snack>>('/snacks', { params }).then((r) => r.data),
  newArrivals: (limit?: number) =>
    api.get<Snack[]>('/snacks/new', { params: { limit } }).then((r) => r.data),
  search: (params: { q: string; page?: number; limit?: number }) =>
    api.get<Paginated<Snack>>('/snacks/search', { params }).then((r) => r.data),
  detail: (id: number) => api.get<Snack>(`/snacks/${id}`).then((r) => r.data),
  blogReviews: (id: number) =>
    api.get<BlogPost[]>(`/snacks/${id}/blog-reviews`).then((r) => r.data),
};

// Categories
export const categoriesApi = {
  list: () => api.get<Category[]>('/categories').then((r) => r.data),
};

// Brands
export const brandsApi = {
  list: () => api.get<Brand[]>('/brands').then((r) => r.data),
};

// Favorites
export const favoritesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<Paginated<Favorite>>('/favorites', { params }).then((r) => r.data),
  add: (snackId: number) =>
    api.post<Favorite>('/favorites', { snackId }).then((r) => r.data),
  remove: (id: number) => api.delete(`/favorites/${id}`).then((r) => r.data),
};

// Reviews
export const reviewsApi = {
  listBySnack: (snackId: number, params?: { page?: number; limit?: number; sort?: string }) =>
    api.get<Paginated<Review>>(`/reviews/snack/${snackId}`, { params }).then((r) => r.data),
  create: (data: { snackId: number; rating: number; content: string }) =>
    api.post<Review>('/reviews', data).then((r) => r.data),
  update: (id: number, data: { rating?: number; content?: string }) =>
    api.put<Review>(`/reviews/${id}`, data).then((r) => r.data),
  delete: (id: number) => api.delete(`/reviews/${id}`).then((r) => r.data),
  listByMe: () =>
    api.get<(Review & { snack: { id: number; name: string; imageUrl: string | null } })[]>('/reviews/me').then((r) => r.data),
};

// Recommendations
export const recommendationsApi = {
  get: (limit?: number) =>
    api.get<Snack[]>('/recommendations', { params: { limit } }).then((r) => r.data),
};

export default api;

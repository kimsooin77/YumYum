export interface User {
  id: number;
  email: string;
  nickname: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Snack {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  releaseDate: string | null;
  createdAt: string;
  brand: Brand;
  category: Category;
  avgRating: number;
  reviewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
  favoriteId?: number | null;
}

export interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: { id: number; nickname: string };
}

export interface Favorite {
  id: number;
  snackId: number;
  snack: Snack;
  createdAt: string;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
}

export type UserRole = 'Admin' | 'Analyst' | 'Reviewer';

export interface UserCreate {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface ApiError {
  detail: string | { loc: (string | number)[]; msg: string; type: string }[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  new_password: string;
}

export interface ProductCreate {
  code: string;
  description: string;
  qty_per_box: number;
  exworks_price: string; // Serialised as numeric string
  series: string;
  shipping_route: string;
}

export interface ProductResponse {
  id: string;
  code: string;
  description: string;
  qty_per_box: number;
  exworks_price: string;
  series: string;
  shipping_route: string;
  is_active: boolean;
  created_at: string;
}

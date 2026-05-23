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

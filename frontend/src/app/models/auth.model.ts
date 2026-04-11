import { ApiResponse } from './contact.model';

export type UserRole = 'admin' | 'manager' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse extends ApiResponse<User> {
  token?: string;
}

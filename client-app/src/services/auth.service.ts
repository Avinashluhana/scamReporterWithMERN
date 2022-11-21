import httpService from './http.service';
import { ApiError, ApiResponse } from './response.interface';

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  fullName: string;
}

export interface ForgetPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  password: string;
  token: string;
}

export interface LoginSuccess {
  access_token: string;
}

export interface RegisterSuccess {
  message: string;
}

export async function login(input: LoginInput) {
  try {
    const resp = await httpService.post<ApiResponse<LoginSuccess>>('/auth/login', input);
    return resp.data;
  } catch (error) {
    throw error;
  }
}

export async function register(input: RegisterInput) {
  try {
    const resp = await httpService.post<ApiResponse<RegisterSuccess>>('/auth/register', input);
    return resp.data;
  } catch (error) {
    throw error;
  }
}

export async function forgetPassword(input: ForgetPasswordInput) {
  try {
    const resp = await httpService.post<ApiResponse<{ message: string }>>('/auth/forget-password', input);
    return resp.data;
  } catch (error) {
    throw error;
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  try {
    const resp = await httpService.post<ApiResponse<{ message: string }>>('/auth/reset-password', input);
    return resp.data;
  } catch (error) {
    throw error;
  }
}

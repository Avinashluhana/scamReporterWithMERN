import httpService from './http.service';
import { ApiResponse } from './response.interface';

export interface UpdateUserInput {
  active?: boolean;
}

export interface UpdateSelfInfoInput {
  fullName?: string;
  email?: string;
}

export interface User {
  id: string,
  fullName: string,
  email: string,
  active: boolean,
  role: string,
}

export interface PaginationParams {
  totalItems: number,
  skip: number,
  limit: number,
}

export async function getSelfInfo() {
  try {

    const resp = await httpService.get('/users/me');
    return resp.data;

  } catch(error) {
    throw error;
  }
}

export async function updateSelfInfo(input: UpdateSelfInfoInput) {
  try {

    const resp = await httpService.patch('/users/me', input);
    return resp.data;

  } catch(error) {
    throw error;
  }
}

export async function getUserList() {
  try {

    const resp = await httpService.get<ApiResponse<User[]>>('users');
    return resp.data;

  } catch(error) {
    throw error;
  }
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  try {

    const resp = await httpService.patch(`/users/${userId}`, input);
    return resp.data;

  } catch(error) {
    throw error;
  }
}

export async function deleteUser(userId: string) {
  try {

    const resp = await httpService.delete(`/users/${userId}`);
    return resp.data;

  } catch(error) {
    throw error;
  }
}
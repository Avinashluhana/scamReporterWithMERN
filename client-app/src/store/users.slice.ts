
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppThunk, RootState } from "../app/store";
import { Notification } from '../notification.helper';
import { 
  getUserList, 
  User, 
  PaginationParams,
  deleteUser,
  updateUser,
 } from '../services/user.service';

export interface UsersState {
  users: User[],
  error: any,
  loading: boolean,
  pagination: PaginationParams,
  processing: boolean;
}

const initialState: UsersState = {
  users: [],
  error: undefined,
  loading: false,
  processing: false,
  pagination: {
    totalItems: 0,
    skip: 0,
    limit: 0,
  }
}

export const usersSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    getUsersStart(state) {
      state.loading = true;
    },

    getUsersSuccess(state, action: PayloadAction<User[]>) {
      state.loading = false;
      state.users = action.payload;
    },

    getUsersFailed(state, action: PayloadAction<any>) {
      state.loading = false;
      state.error = action.payload;
    },

    startProcessing(state) {
      state.processing = true;
    },

    stopProcessing(state) {
      state.processing = false;
    },

    activeInactive(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex(u => u.id == action.payload.id);
      if (idx > -1) state.users.splice(idx, 1, action.payload);
    },

    removeUser(state, action: PayloadAction<User>) {
      const idx = state.users.findIndex(u => u.id == action.payload.id);
      if (idx > -1) state.users.splice(idx, 1);
    }

  }
})

const { getUsersStart, getUsersSuccess, getUsersFailed, activeInactive, removeUser, startProcessing, stopProcessing } = usersSlice.actions;
export type { User };


export const selectUsers = (state: RootState) => state.users;

export const getUsers = (skip: number = 0, limit: number = 10): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(getUsersStart());

    const result = await getUserList();
    dispatch(getUsersSuccess(result.data))
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getUsersFailed(error.response?.data || error));
    }
  }
}

export const activeInactiveUser = (userId: string, input: any): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(startProcessing())

    const result = await updateUser(userId, input);
    dispatch(activeInactive(result.data))
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getUsersFailed(error.response?.data || error));
    }
  } finally {
    dispatch(stopProcessing())
  }
}

export const delUser = (userId: string): AppThunk => async (dispatch, getState) => {
  try {

    const result = await deleteUser(userId);
    dispatch(removeUser(result.data))
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getUsersFailed(error.response?.data || error));
    }
  } finally {
    dispatch(stopProcessing())
  }
}

export default usersSlice.reducer;
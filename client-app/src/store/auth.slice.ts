import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { login, register, RegisterInput } from '../services/auth.service';
import jwt_decode from 'jwt-decode';
import * as storage from '../store/storage';
import { Notification } from '../notification.helper';
import { AxiosError } from "axios";
import { updateSelfInfo } from '../services/user.service';

export interface User {
  sub: string;
  fullName: string;
  email: string;
  roles: string[];
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  registered: boolean;
  loading: boolean;
  error: any;
}

const user = storage.get<User>(storage.Key.USER);
const token = storage.get<string>(storage.Key.ACCESS_TOKEN);

const initialState: AuthState = {
  user: user,
  isAuthenticated:  token && token.length > 0 ? true: false,
  registered: false,
  loading: false,
  error: undefined,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    registerSuccess: (state) => {
      state.registered = true;
    },
  }
})

const { loginStart, loginSuccess, loginFailed, logout, registerSuccess } = authSlice.actions;

export { loginStart, loginSuccess, loginFailed };

export const selectAuth = (state: RootState) => state.auth;

export const dologin = (email: string, password: string, postLoginCB: Function): AppThunk => async (dispatch, getState) => {
  try {
    dispatch(loginStart());

    const result = await login({ email, password });

    const payload: any = jwt_decode(result.data.access_token);    

    const authUser = payload;

    // save to browser storage
    storage.set(storage.Key.ACCESS_TOKEN, result.data.access_token);
    storage.set(storage.Key.USER, authUser);

    dispatch(loginSuccess(authUser))
    postLoginCB();
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(loginFailed(error.response?.data || error));
    }
  }
}

export const doregister = (input: RegisterInput): AppThunk => async (dispatch, getState) => {
  try {

    const result = await register(input);
    if (result) Notification.success(result.data.message);

    dispatch(registerSuccess());

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(loginFailed(error.response?.data || error));
    }
  }
}

export const dologout = (): AppThunk => async (dispatch, getState) => {
  try {

    // unset following properties from browser storage
    storage.del(storage.Key.ACCESS_TOKEN);
    storage.del(storage.Key.USER);

    dispatch(logout())
  
  } catch (error) {
    dispatch(loginFailed(error));
  }
}

export const updateSelf = (input: any): AppThunk => async (dispatch, getState) => {
  try {

    const result = await updateSelfInfo(input);
    if (result) Notification.success(result.data.message);

    dispatch(dologout());

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(loginFailed(error.response?.data || error));
    }
  }
}


export default authSlice.reducer;
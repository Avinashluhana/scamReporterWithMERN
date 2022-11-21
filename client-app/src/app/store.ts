import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../store/auth.slice';
import notifReducer from '../store/notification.slice';
import usersReducer from '../store/users.slice';
import scamReducer from '../store/scam.slice';
import DashboardReducer from '../store/dashboard.slice';
import ChatReducer from '../store/chat.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notification: notifReducer,
    users: usersReducer,
    scam: scamReducer,
    dashboard: DashboardReducer,
    chat: ChatReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

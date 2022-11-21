import { AlertColor } from "@mui/material/Alert";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface Notification {
  message: string | undefined,
  severity: AlertColor | undefined,
  timeout: number,
}

export interface NotificationState {
  open: boolean,
  message: string | undefined,
  severity: AlertColor | undefined,
  timeout: number,
}

const initialState: NotificationState = {
  open: false,
  message: undefined,
  severity: undefined,
  timeout: 0,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify: (state,  action: PayloadAction<Notification>) => {
      state.open = true;
      state.message = action.payload.message;
      state.severity = action.payload.severity;
      state.timeout = action.payload.timeout;
    },
    close: (state) => {
      state.open = false;
      state.message = undefined;
      state.severity = undefined;
      state.timeout = 0;
    },
  }
})

const { notify, close } = notificationSlice.actions;

export { notify, close };

export const selectNotification = (state: RootState) => state.notification;


export default notificationSlice.reducer;
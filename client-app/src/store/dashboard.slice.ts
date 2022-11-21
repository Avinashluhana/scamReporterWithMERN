import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppThunk, RootState } from "../app/store";
import { getMyStats, getScamStats, MyStats, Stats } from '../services/scam.service';
import { Notification } from '../notification.helper';

export interface DashboardState {
  loading: boolean,
  myStats: MyStats,
  stats: Stats,
  error: any,
}

const initialState: DashboardState = {
  loading: false,
  myStats: {
    totalReportedScams: 0,
    isNewsSubscribed: false,
  },
  stats: {
    subscribers: 0,
    scams: {
      total: 0,
      approved: 0,
      pending: 0
    }
  },
  error: undefined,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchMyStatsStart: (state) => {
      state.loading = true;
    },
    fetchMyStatsSuccess: (state,  action: PayloadAction<MyStats>) => {
      state.loading = false;
      state.myStats = action.payload;
    },
    fetchMyStatsFailed: (state,  action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchStatsStart: (state) => {
      state.loading = true;
    },
    fetchStatsSuccess: (state,  action: PayloadAction<Stats>) => {
      state.loading = false;
      state.stats = action.payload;
    },
    fetchStatsFailed: (state,  action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },

  }
})

const { 
  fetchMyStatsStart,
  fetchMyStatsSuccess, 
  fetchMyStatsFailed,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFailed,
} = dashboardSlice.actions;


export const selectDashboard = (state: RootState) => state.dashboard;

export const fetchMyStats = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(fetchMyStatsStart());

    const result = await getMyStats();
    dispatch(fetchMyStatsSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(fetchMyStatsFailed(error.response?.data || error));
    }
  }
}

export const fetchStats = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(fetchStatsStart());

    const result = await getScamStats();
    dispatch(fetchStatsSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(fetchStatsFailed(error.response?.data || error));
    }
  }
}

export default dashboardSlice.reducer;
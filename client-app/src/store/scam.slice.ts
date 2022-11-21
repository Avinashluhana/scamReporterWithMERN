import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { Notification } from '../notification.helper';
import { AppThunk, RootState } from "../app/store";
import { 
  getScamList, 
  postScam, 
  getScamById, 
  Scam, 
  ScamComment, 
  getScamComments, 
  subscribeNewsletter,
  addScamComment,
  MyStats,
  getScamTypes,
  ScamType,
  editScam,
  getMyScams,
  deleteScam,
  changeScamStatus,
  getScam,
  getSubscriptionList,
  removeSubscription,
  Subscription,
} from '../services/scam.service';

export interface PaginationParams {
  totalItems: number;
  skip: number;
  limit: number;
}

export interface ScamState {
  items: Scam[];
  loading: boolean;
  pagination: PaginationParams;
  error: any;
  selected: Scam|undefined;
  scamComments: ScamComment[];
  loadingComments: boolean;
  commentsError: any;
  postingComment: boolean;
  postCommentError: any;
  types: ScamType[],
  subscriptions: Subscription[],
  search: string;
  topScams: Scam[];
}
 
const initialState: ScamState = {
  items: [],
  loading: false,
  pagination: {
    totalItems: 0,
    skip: 0,
    limit: 0,
  },
  error: undefined,
  selected: undefined,
  scamComments: [],
  loadingComments: false,
  commentsError: undefined,
  postingComment: false,
  postCommentError: undefined,
  types: [],
  subscriptions: [],
  search: '',
  topScams: []
};

export const scamSlice = createSlice({
  name: 'scams',
  initialState,
  reducers: {
    getScamStart: (state) => {
      state.loading = true;
    },
    getScamSuccess: (state, action: PayloadAction<Scam[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    getScamFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerScamStart: (state) => {
      state.loading = true;
    },
    registerScamSuccess: (state, action: PayloadAction<Scam>) => {
      state.items.push(action.payload);
      state.loading = false;
    },
    registerScamFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getScamDetailStart: (state) => {
      state.loading = true;
    },
    getScamDetailSuccess: (state, action: PayloadAction<Scam>) => {
      state.loading = false;
      state.selected = action.payload;
    },
    getScamDetailFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload
    },
    getScamCommentsStart: (state) => {
      state.loadingComments = true;
    },
    getScamCommentsSuccess: (state, action: PayloadAction<ScamComment[]>) => {
      state.loadingComments = false;
      state.scamComments = action.payload;
    },
    getScamCommentsFailed: (state, action: PayloadAction<any>) => {
      state.loadingComments = false;
      state.commentsError = action.payload;
    },
    postCommentStart: (state) => {
      state.postingComment = true;
    },
    postCommentSuccess: (state, action: PayloadAction<ScamComment>) => {
      state.postingComment = false;
      state.scamComments.splice(0, 0, action.payload);
    },
    postCommentFailed: (state, action: PayloadAction<any>) => {
      state.postingComment = false;
      state.postCommentError = action.payload;
    },
    getScamTypesSuccess: (state, action: PayloadAction<ScamType[]>) => {
      state.types = action.payload;
    },
    updateScamStart: (state) => {
      state.loading = true;
    },
    updateScamSuccess: (state, action: PayloadAction<Scam>) => {
      state.loading = false;
      const uScam = action.payload;
      const index = state.items.findIndex( scam => scam.id == uScam.id );
      if (index > -1)
        state.items.splice(index, 1, uScam);
    },
    updateScamFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getUserScamsStart: (state) => {
      state.loading = true;
    },
    getUserScamsSuccess: (state, action: PayloadAction<Scam[]>) => {
      state.loading = false;
      state.items = action.payload;
    },
    getUserScamsFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    removeScamStart: (state) => {},
    removeScamSuccess: (state, action: PayloadAction<Scam>) => {
      state.loading = false;
      const idx = state.items.findIndex( s => s.id == action.payload.id );
      if (idx > -1) state.items.splice(idx, 1);
    },
    removeScamFailed: (state, action: PayloadAction<any>) => {},

    updateScamStatusStart: (state) => {},
    updateScamStatusSuccess: (state, action: PayloadAction<Scam>) => {
      state.loading = false;
      const idx = state.items.findIndex( s => s.id == action.payload.id );
      if (idx > -1) state.items.splice(idx, 1, action.payload);
    },
    updateScamStatusFailed: (state, action: PayloadAction<any>) => {},
    getSubscriptionListStart: (state) => {
      state.loading = true;
    },
    getSubscriptionListSuccess: (state, action: PayloadAction<Subscription[]>) => {
      state.loading = false;
      state.subscriptions = action.payload;
    },
    getSubscriptionListFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteSubscriptionSuccess: (state, action: PayloadAction<Subscription>) => {
      const idx = state.subscriptions.findIndex( sub => sub.id == action.payload.id );
      if (idx > -1) state.subscriptions.splice(idx, 1);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setTopScams: (state, action: PayloadAction<Scam[]>) => {
      state.topScams = action.payload;
    }
  }
})

const { 
  getScamStart, 
  getScamSuccess, 
  getScamFailed, 
  registerScamStart, 
  registerScamSuccess, 
  registerScamFailed,
  getScamDetailStart,
  getScamDetailSuccess,
  getScamDetailFailed,
  getScamCommentsStart,
  getScamCommentsSuccess,
  getScamCommentsFailed,
  postCommentStart,
  postCommentSuccess,
  postCommentFailed,
  getScamTypesSuccess,
  updateScamStart,
  updateScamSuccess,
  updateScamFailed,
  getUserScamsStart,
  getUserScamsSuccess,
  getUserScamsFailed,
  removeScamStart,
  removeScamSuccess,
  removeScamFailed,
  updateScamStatusStart,
  updateScamStatusSuccess,
  updateScamStatusFailed,
  getSubscriptionListStart,
  getSubscriptionListSuccess,
  getSubscriptionListFailed,
  deleteSubscriptionSuccess,
  setSearch,
  setTopScams,
} = scamSlice.actions;

export { setSearch };

export const selectScam = (state: RootState) => state.scam;

export const findScam = (query?: any): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getScamStart());
    const result = await getScam(query);
    dispatch(getScamSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getScamFailed(error.response?.data || error));
    }
  }
}

export const findScamList = (skip: number, limit: number): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getScamStart());
    const result = await getScamList();
    dispatch(getScamSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getScamFailed(error.response?.data || error));
    }
  }
}


export const getUserScams = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getUserScamsStart());
    const result = await getMyScams();
    dispatch(getUserScamsSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getUserScamsFailed(error.response?.data || error));
    }
  }
}


export const registerScam = (input: any, successCallback: Function): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(registerScamStart());

    const result = await postScam(input);
    dispatch(registerScamSuccess(result.data));
    Notification.success('scam registered successfully');
    successCallback();
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(registerScamFailed(error.response?.data || error));
    }
  }
}

export const getScamDetail = (scamId: string): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(registerScamStart());

    const result = await getScamById(scamId);
    dispatch(getScamDetailSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getScamDetailFailed(error.response?.data || error));
    }
  }
}

export const subscribeNL = (input: any): AppThunk => async (dispatch, getState) => {
  try {

    const result = await subscribeNewsletter(input);
    Notification.success(result.data.message);
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
    }
  }
}

export const fetchScamComments = (scamId: string): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getScamCommentsStart());

    const result = await getScamComments(scamId);
    dispatch(getScamCommentsSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getScamCommentsFailed(error.response?.data || error));
    }
  }
}

export const postScamComment = (scamId: string, input: any): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(postCommentStart());

    const result = await addScamComment(scamId, input);
    dispatch(postCommentSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(postCommentFailed(error.response?.data || error));
    }
  }
}

export const fetchScamTypes = (): AppThunk => async (dispatch, getState) => {
  try {

    const result = await getScamTypes();
    dispatch(getScamTypesSuccess(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
    }
  }
}

export const updateScam = (scamId: string, input: any, successCallback: Function): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(updateScamStart());

    const result = await editScam(scamId, input);
    dispatch(updateScamSuccess(result.data));

    successCallback();

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(updateScamFailed(message));
    }
  }
}

export const removeScam = (scamId: string, successCallback?: Function): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(removeScamStart());

    const result = await deleteScam(scamId);
    dispatch(removeScamSuccess(result.data));

    if (successCallback) successCallback();

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(removeScamFailed(message));
    }
  }
}

export const updateScamStatus = (scamId: string, input: any, successCallback?: Function): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(updateScamStatusStart());

    const result = await changeScamStatus(scamId, input);
    dispatch(updateScamStatusSuccess(result.data));

    if (successCallback) successCallback();

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(updateScamStatusFailed(message));
    }
  }
}

export const getSubscriptions = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getSubscriptionListStart());

    const result = await getSubscriptionList();
    dispatch(getSubscriptionListSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getSubscriptionListFailed(message));
    }
  }
}

export const deleteSubscription = (subscriptionId: string): AppThunk => async (dispatch, getState) => {
  try {

    const result = await removeSubscription(subscriptionId);
    dispatch(deleteSubscriptionSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getSubscriptionListFailed(message));
    }
  }
}

export const getTopScams = (limit: number, skip: number): AppThunk => async (dispatch, getState) => {
  try {

    const result = await getScam({ limit });
    dispatch(setTopScams(result.data));
  
  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
    }
  }
}

export type { Scam, ScamComment, MyStats };

export default scamSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { AppThunk, RootState } from "../app/store";
import { Notification } from '../notification.helper';
import { 
  Chat, 
  ChatMessage, 
  ChatUser, 
  getSupportPersonals, 
  getChats, 
  createChat, 
  getMessages, 
  editMessage, 
  CreateChatInput,
  sendMessage,
} from '../services/support.service';


export interface ChatState {
  loading: boolean,
  users: ChatUser[],
  chats: Chat[],
  messages: ChatMessage[],
  selected: Chat | undefined,
  error: any,
}

const initialState: ChatState = {
  loading: false,
  users: [],
  chats: [],
  messages: [],
  selected: undefined,
  error: undefined,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getSupportUsersStart: (state) => {
      state.loading = false;
    },
    getSupportUsersSuccess: (state, action: PayloadAction<ChatUser[]>) => {
      state.loading = false;
      state.users = action.payload;
    },
    getSupportUsersFailed: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getChatListStart: (state) => {

    },
    getChatListSuccess: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    getChatListFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    getChatMessagesStart: (state) => {},
    getChatMessagesSuccess: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    getChatMessagesFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    updateMessageStart: (state) => {},
    updateMessageSuccess: (state, action: PayloadAction<ChatMessage>) => {
      const idx = state.messages.findIndex(msg => msg.id == action.payload.id);
      if (idx > -1) state.messages.splice(idx, 1, action.payload);
    },
    updateMessageFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    createChatStart: (state) => {},
    createChatSuccess: (state, action: PayloadAction<Chat>) => {
      const cidx = state.chats.findIndex(c => c.id == action.payload.id);
      if (cidx > -1) {
        state.chats.splice(cidx, 1, action.payload);
        return;
      }
      else state.chats.splice(0, 0, action.payload);
    },
    createChatFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    sendMessageStart: (state) => {},
    sendMessageSuccess: (state, action: PayloadAction<ChatMessage>) => {
      const idx = state.messages.findIndex( m => m.id == action.payload.id );      
      if (idx > -1) {
        state.messages.splice(idx, 1, action.payload);
        return;
      }
      state.messages.splice(0, 0, action.payload);
    },
    sendMessageFailed: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },
    setSelectedChat: (state, action: PayloadAction<Chat>) => {
      state.selected = action.payload;
    },
  }
})

const { 
  getSupportUsersStart, 
  getSupportUsersSuccess, 
  getSupportUsersFailed,
  getChatListStart,
  getChatListSuccess,
  getChatListFailed,
  getChatMessagesStart,
  getChatMessagesSuccess,
  getChatMessagesFailed,
  updateMessageStart,
  updateMessageSuccess,
  updateMessageFailed,
  createChatStart,
  createChatSuccess,
  createChatFailed,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailed,
  setSelectedChat,
} = chatSlice.actions;

export { setSelectedChat, sendMessageSuccess, updateMessageSuccess, createChatSuccess }; 

export const selectChat = (state: RootState) => state.chat;

export const getSupportUsers = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getSupportUsersStart());

    const result = await getSupportPersonals();
    dispatch(getSupportUsersSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getSupportUsersFailed(message));
    }
  }
}

export const startChat = (input: CreateChatInput): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(createChatStart());

    const result = await createChat(input);
    dispatch(createChatSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(createChatFailed(message));
    }
  }
}

export const getChatList = (): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getChatListStart());

    const result = await getChats();
    dispatch(getChatListSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getChatListFailed(message));
    }
  }
}

export const getChatMessages = (chatId: string): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(getChatMessagesStart());

    const result = await getMessages(chatId);
    dispatch(getChatMessagesSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(getChatMessagesFailed(message));
    }
  }
}

export const updateMessage = (messageId: string, input: any): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(updateMessageStart());

    const result = await editMessage(messageId, input);
    dispatch(updateMessageSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(updateMessageFailed(message));
    }
  }
}

export const postMessage = (chatId: string, input: any): AppThunk => async (dispatch, getState) => {
  try {

    dispatch(sendMessageStart());

    const result = await sendMessage(chatId, input);
    dispatch(sendMessageSuccess(result.data));

  } catch (error) {
    if (error instanceof AxiosError) {
      const message = error.response?.data.message || error.message;
      Notification.error(message);
      dispatch(sendMessageFailed(message));
    }
  }
}

export default chatSlice.reducer;
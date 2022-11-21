
import httpService from './http.service';
import { ApiResponse } from './response.interface';

export interface CreateChatInput {
  participants: string[];
}

export interface MessageInput {
  content: string;
}

export interface ChatUser {
  id: string;
  fullName: string;
  avatar: string;
}

export interface Chat {
  id: string,
  participants: ChatUser[],
  createdAt: string,
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: ChatUser,
  createdAt: string,
  updatedAt: string,
}

export async function getChats() {
  try {

    const resp = await httpService.get<ApiResponse<Chat[]>>('/support/chats');
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function createChat(input: CreateChatInput) {
  try {

    const resp = await httpService.put<ApiResponse<Chat>>('support/chats', input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getMessages(chatId: string) {
  try {

    const resp = await httpService.get<ApiResponse<ChatMessage[]>>(`/support/chats/${chatId}/messages`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function sendMessage(chatId: string, input: MessageInput) {
  try {

    const resp = await httpService.post<ApiResponse<ChatMessage>>(`/support/chats/${chatId}/messages`, input)
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function editMessage(messageId: string, input: MessageInput) {
  try {

    const resp = await httpService.patch<ApiResponse<ChatMessage>>(`/support/chats/messages/${messageId}`, input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getSupportPersonals() {
  try {

    const resp = await httpService.get<ApiResponse<ChatUser[]>>('/support/personals');
    return resp.data;

  } catch (error) {
    throw error;
  }
}



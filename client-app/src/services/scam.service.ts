import httpService from './http.service';
import { ApiResponse } from './response.interface';

export interface Scam {
  id: string;
  userEmail: string;
  subscribeNewsLetter: true;
  scamType: string;
  pseudonumUsed: string;
  fraudulentEmail: string;
  phoneCode: string;
  phoneNumber: string;
  fraudulentWebsite: string;
  scamContent: string;
  explanation: string;
  media: string[],
  createdAt: string;
  sellPurchaseRelated: string;
  status: string;
}

export interface ScamInput {
  userEmail: string;
  subscribeNewsLetter: boolean;
  scamType: string;
  pseudonumUsed: string;
  fraudulentEmail: string;
  phoneCode: string;
  phoneNumber: string;
  fraudulentWebsite: string;
  scamContent: string;
  explanation: string;
}

export interface CommentUser {
  id: string;
  fullName: string;
  avatar: string;
}

export interface ScamComment {
  id: string;
  author: CommentUser;
  content: string; 
  createdAt: string;
}

export interface CommentInput {
  content: string;
}

export interface SubscribeNewsletterInput {
  email: string,
}

export interface ScamType {
  id: string,
  name: string;
}

export interface CheckScamResult {
  url: string;
  threat: number;
}

export interface MyStats {
  totalReportedScams: number;
  isNewsSubscribed: boolean;
}

export interface Stats {
  subscribers: number;
  scams: {
    total: number;
    approved: number;
    pending: number;
  }
}

export interface ChangeStatus {
  approve: boolean
}

export interface Subscription {
  id: string;
  email: string;
  user: {
    id: string;
    fullName: string;
  };
}

export async function getScam(query?: any) {
  try {

    const q = query ? new URLSearchParams(query).toString() : '';
    const resp = await httpService.get<ApiResponse<Scam[]>>(`/scam?${q}`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getScamList() {
  try {

    const resp = await httpService.get<ApiResponse<Scam[]>>('/scam/list');
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getScamTypes() {
  try {

    const resp = await httpService.get<ApiResponse<ScamType[]>>('/scam/types');
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getMyScams() {
  try {

    const resp = await httpService.get<ApiResponse<Scam[]>>('/scam/my');
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function postScam(input: ScamInput) {
  try {

    const resp = await httpService.post<ApiResponse<Scam>>('/scam', input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function subscribeNewsletter(input: SubscribeNewsletterInput) {
  try {

    const resp = await httpService.post<ApiResponse<{message: string}>>('/scam/subscribe-newsletter',input);
    return resp.data;
    
  } catch (error) {
    console.error(`subscribeNewsletter api failed with error: `, error);
    throw error;
  }
}

export async function checkScam(url: string) {
  try {
    const resp = await httpService.get<ApiResponse<CheckScamResult>>('scam/check', { 
      params: {
        url
      } 
    });
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getScamStats() {
  try {

    const resp = await httpService.get<ApiResponse<Stats>>(`/scam/stats`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getMyStats() {
  try {

    const resp = await httpService.get<ApiResponse<MyStats>>(`/scam/my-stats`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getSubscriptionList() {
  try {

    const resp = await httpService.get<ApiResponse<Subscription[]>>(`/scam/subscriptions`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function removeSubscription(subscriptionId: string) {
  try {

    const resp = await httpService.delete<ApiResponse<Subscription>>(`/scam/subscriptions/${subscriptionId}`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}


export async function getScamComments(scamId: string) {
  try {

    const resp = await httpService.get<ApiResponse<ScamComment[]>>(`/scam/${scamId}/comments`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function addScamComment(scamId: string, input: CommentInput) {
  try {

    const resp = await httpService.post<ApiResponse<ScamComment>>(`/scam/${scamId}/comments`, input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function editScam(scamId: string, input: ScamInput) {
  try {

    const resp = await httpService.patch<ApiResponse<Scam>>(`/scam/${scamId}`, input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function getScamById(scamId: string) {
  try {

    const resp = await httpService.get<ApiResponse<Scam>>(`/scam/${scamId}`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function changeScamStatus(scamId: string, input: ChangeStatus) {
  try {

    const resp = await httpService.patch<ApiResponse<Scam>>(`/scam/${scamId}/status`, input);
    return resp.data;

  } catch (error) {
    throw error;
  }
}

export async function deleteScam(scamId: string) {
  try {

    const resp = await httpService.delete<ApiResponse<Scam>>(`/scam/${scamId}`);
    return resp.data;

  } catch (error) {
    throw error;
  }
}
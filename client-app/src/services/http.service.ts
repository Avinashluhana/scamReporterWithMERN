
import axios from 'axios';
import config from '../config';
import * as storage from '../store/storage';

const httpService = axios.create({
  baseURL: config.BASEURL,
})

const authEndpoints = [
  '/auth/login',
  '/auth/register'
];

httpService.interceptors.request.use(function (config) {
  // Do something before request is sent

  const url = `${config.url}`;
  if (authEndpoints.includes(url)) return config;

  const token = storage.get(storage.Key.ACCESS_TOKEN);

  config.headers = {
    Authorization: `Bearer ${token}`
  };

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

httpService.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  if (error?.response?.status === 401) {
    storage.clear(); // clear user session info
    const redirectUrl = window.location;
    window.location.href = `/user/login?redirect=${redirectUrl}`;
  }

  return Promise.reject(error);
});


export default httpService;
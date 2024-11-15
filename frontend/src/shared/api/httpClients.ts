import axios from 'axios';

export const backendClient = axios.create({
  baseURL: `http://localhost:3000`,
  withCredentials: false
});

export const thirdPartyHTTPClient = axios.create({
  withCredentials: false
});

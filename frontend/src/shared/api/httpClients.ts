import axios from 'axios';

export const backendClient = axios.create({
  baseURL: `${import.meta.env.API_BACKEND_SERVICE}`,
  withCredentials: false
});

export const thirdPartyHTTPClient = axios.create({
  withCredentials: false
});

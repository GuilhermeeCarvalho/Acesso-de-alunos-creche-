import { api, unwrapResponse } from './api.js';

export async function login(credentials) {
  const response = await api.post('/auth/login', credentials);
  return unwrapResponse(response);
}

export async function register(credentials) {
  const response = await api.post('/auth/register', credentials);
  return unwrapResponse(response);
}
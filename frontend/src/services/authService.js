import { api, unwrapResponse } from './api.js';

export async function login(credentials) {
  const params = new URLSearchParams();
  params.append('email', credentials.email);
  params.append('senha', credentials.senha);

  const response = await api.post('/auth/login', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  return unwrapResponse(response);
}

export async function register(credentials) {
  const response = await api.post('/auth/register', credentials);
  return unwrapResponse(response);
}
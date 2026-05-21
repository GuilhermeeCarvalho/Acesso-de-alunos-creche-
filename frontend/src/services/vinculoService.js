import { api, unwrapResponse } from './api.js';

export async function createVinculo(payload) {
  const response = await api.post('/vinculos', payload);
  return unwrapResponse(response);
}
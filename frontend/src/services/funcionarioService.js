import { api, unwrapResponse } from './api.js';

export async function listFuncionarios() {
  const response = await api.get('/funcionarios');
  return unwrapResponse(response);
}

export async function createFuncionario(payload) {
  const response = await api.post('/funcionarios', payload);
  return unwrapResponse(response);
}

export async function updateFuncionario(id, payload) {
  const response = await api.put(`/funcionarios/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteFuncionario(id) {
  const response = await api.delete(`/funcionarios/${id}`);
  return unwrapResponse(response);
}
import { api, unwrapResponse } from './api.js';

export async function listAlunos() {
  const response = await api.get('/criancas');
  return unwrapResponse(response);
}

export async function createAluno(payload) {
  const response = await api.post('/criancas', payload);
  return unwrapResponse(response);
}

export async function updateAluno(id, payload) {
  const response = await api.put(`/criancas/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteAluno(id) {
  const response = await api.delete(`/criancas/${id}`);
  return unwrapResponse(response);
}
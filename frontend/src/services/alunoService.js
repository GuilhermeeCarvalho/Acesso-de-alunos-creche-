import { api, unwrapResponse } from './api.js';

export async function listAlunos() {
  const response = await api.get('/alunos');
  return unwrapResponse(response);
}

export async function createAluno(payload) {
  const response = await api.post('/alunos', payload);
  return unwrapResponse(response);
}

export async function updateAluno(id, payload) {
  const response = await api.put(`/alunos/${id}`, payload);
  return unwrapResponse(response);
}

export async function deleteAluno(id) {
  const response = await api.delete(`/alunos/${id}`);
  return unwrapResponse(response);
}
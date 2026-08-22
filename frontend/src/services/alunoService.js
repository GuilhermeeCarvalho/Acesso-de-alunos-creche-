import { api, unwrapResponse } from './api.js';

export async function listAlunos() {
  const response = await api.get('/criancas');
  return unwrapResponse(response);
}

export async function getDocumento(id) {
  const response = await api.get(`/criancas/${id}/documento`);
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

export async function uploadDocumento(id, arquivo) {
  const form = new FormData();
  form.append('arquivo', arquivo);

  const response = await api.post(`/criancas/${id}/documento`, form);

  return unwrapResponse(response);
}

export async function deleteDocumento(id) {
  const response = await api.delete(`/criancas/${id}/documento`);
  return unwrapResponse(response);
}
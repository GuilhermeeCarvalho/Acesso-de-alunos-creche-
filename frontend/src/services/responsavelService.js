import { api, unwrapResponse } from './api.js';

export async function listResponsaveis() {
  const response = await api.get('/responsaveis');
  return unwrapResponse(response);
}

export async function createResponsavel(payload) {
  const response = await api.post('/responsaveis', payload);
  return unwrapResponse(response);
}

export async function listResponsaveisDaCrianca(criancaId) {
  const response = await api.get(`/vinculos/crianca/${criancaId}`);
  return unwrapResponse(response);
}
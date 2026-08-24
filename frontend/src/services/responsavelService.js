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

export async function updateResponsavel(responsavelId, payload) {
  const response = await api.put(`/responsaveis/${responsavelId}`, payload);
  return unwrapResponse(response);
}

export async function deleteResponsavel(responsavelId) {
  const response = await api.delete(`/responsaveis/${responsavelId}`);
  return unwrapResponse(response);
}

export async function updateVinculoRelacao(criancaId, responsavelId, relacao) {
  const response = await api.put(`/vinculos/crianca/${criancaId}/responsavel/${responsavelId}/relacao`, { relacao });
  return unwrapResponse(response);
}

export async function deleteVinculo(criancaId, responsavelId) {
  const response = await api.delete(`/vinculos/crianca/${criancaId}/responsavel/${responsavelId}`);
  return unwrapResponse(response);
}
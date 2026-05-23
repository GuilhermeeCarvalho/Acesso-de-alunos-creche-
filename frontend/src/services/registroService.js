import { api, unwrapResponse } from './api.js';

export async function listRegistros() {
  const response = await api.get('/registro');
  return unwrapResponse(response);
}

export async function createRegistro(payload) {
  return registrarMovimentacao(payload?.tipo, payload);
}

export async function registrarEntradaSaida(payload) {
  return registrarMovimentacao(payload?.tipo, payload);
}

export async function registrarMovimentacao(tipo, payload) {
  if (tipo !== 'entrada' && tipo !== 'saida') {
    throw new Error('Tipo de registro inválido.');
  }

  const response = await api.post(`/registro/${tipo}`, payload);
  return unwrapResponse(response);
}
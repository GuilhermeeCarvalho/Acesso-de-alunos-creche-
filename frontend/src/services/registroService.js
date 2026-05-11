import { api, unwrapResponse } from './api.js';

export async function listRegistros() {
  const response = await api.get('/registros');
  return unwrapResponse(response);
}

export async function createRegistro(payload) {
  const response = await api.post('/registros', payload);
  return unwrapResponse(response);
}

export async function registrarEntradaSaida(payload) {
  const response = await api.post('/registros/entrada-saida', payload);
  return unwrapResponse(response);
}
import assert from 'node:assert/strict';
import test from 'node:test';

import { registroForaDoHorario } from './horarioRegistro.js';

function criarRegistro(overrides = {}) {
  return {
    tipo: 'ENTRADA',
    precisaPlantao: false,
    dataHoraOriginal: '2026-10-04T08:15:00',
    ...overrides,
  };
}

test('uses 08:15 and 16:15 as exact normal schedule times', () => {
  assert.equal(registroForaDoHorario(criarRegistro()), false);
  assert.equal(registroForaDoHorario(criarRegistro({ dataHoraOriginal: '2026-10-04T08:16:00' })), true);
  assert.equal(registroForaDoHorario(criarRegistro({
    tipo: 'SAIDA',
    dataHoraOriginal: '2026-10-04T16:15:00',
  })), false);
  assert.equal(registroForaDoHorario(criarRegistro({
    tipo: 'SAIDA',
    dataHoraOriginal: '2026-10-04T16:14:00',
  })), true);
});

test('checks morning plantao entry against the selected inclusive time range', () => {
  const base = {
    precisaPlantao: true,
    plantaoTurno: 'Matutino',
    horarioPlantao: '07:00-07:30',
  };

  assert.equal(registroForaDoHorario(criarRegistro({ ...base, dataHoraOriginal: '2026-10-04T07:00:00' })), false);
  assert.equal(registroForaDoHorario(criarRegistro({ ...base, dataHoraOriginal: '2026-10-04T07:30:00' })), false);
  assert.equal(registroForaDoHorario(criarRegistro({ ...base, dataHoraOriginal: '2026-10-04T06:30:00' })), true);
});

test('checks afternoon plantao exit against the selected inclusive time range', () => {
  const registro = criarRegistro({
    tipo: 'SAIDA',
    precisaPlantao: true,
    plantaoTurno: 'Vespertino',
    horarioPlantao: '16:15-16:45',
    dataHoraOriginal: '2026-10-04T16:30:00',
  });

  assert.equal(registroForaDoHorario(registro), false);
  assert.equal(registroForaDoHorario({
    ...registro,
    dataHoraOriginal: '2026-10-04T17:00:00',
  }), true);
});

test('uses the normal schedule for the other movement of a plantao student', () => {
  assert.equal(registroForaDoHorario(criarRegistro({
    tipo: 'SAIDA',
    precisaPlantao: true,
    plantaoTurno: 'Matutino',
    horarioPlantao: '07:00-07:30',
    dataHoraOriginal: '2026-10-04T16:15:00',
  })), false);
});

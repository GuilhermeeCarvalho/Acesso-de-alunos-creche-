import test from 'node:test';
import assert from 'node:assert/strict';

import { formatApiError } from './errorFormatter.js';

test('formats validation errors from nested field map', () => {
  const err = {
    response: {
      data: {
        mensagem: 'Erro de validação',
        erros: {
          telefone: 'Telefone inválido. Ex: (47) 99999-9999 ou 47999999999',
          nome: 'Já existe um aluno cadastrado com este nome',
        },
      },
    },
  };

  assert.equal(
    formatApiError(err),
    'Telefone inválido. Use o formato (47) 99999-9999 ou 47999999999. Já existe um aluno cadastrado com este nome.'
  );
});

test('formats duplicate email errors with a friendly text', () => {
  const err = {
    response: {
      data: {
        mensagem: 'Já existe um funcionário cadastrado com este email',
      },
    },
  };

  assert.equal(
    formatApiError(err),
    'Este e-mail já está cadastrado. Use outro endereço para continuar.'
  );
});

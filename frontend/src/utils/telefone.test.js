import test from 'node:test';
import assert from 'node:assert/strict';

import {
  formatTelefoneExistente,
  formatTelefoneInput,
  telefoneCelularValido,
} from './telefone.js';

test('formats phone input as area code and nine-digit mobile number', () => {
  assert.equal(formatTelefoneInput('(47) 99728-5634'), '47 997285634');
  assert.equal(formatTelefoneInput('(11) 98877-6655'), '11 988776655');
  assert.equal(formatTelefoneInput('21 91234-5678'), '21 912345678');
});

test('normalizes an existing eight-digit phone by adding the mobile prefix', () => {
  assert.equal(formatTelefoneExistente('(47) 9728-5634'), '47 997285634');
});

test('requires an area code and a mobile number starting with 9', () => {
  assert.equal(telefoneCelularValido('47 997285634'), true);
  assert.equal(telefoneCelularValido('11 988776655'), true);
  assert.equal(telefoneCelularValido('21 912345678'), true);
  assert.equal(telefoneCelularValido('47 97285634'), false);
  assert.equal(telefoneCelularValido('47 897285634'), false);
});

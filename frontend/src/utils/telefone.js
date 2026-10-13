export function formatTelefoneInput(value) {
  const digits = String(value ?? '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} ${digits.slice(2)}`;
}

export function formatTelefoneExistente(value) {
  let digits = String(value ?? '').replace(/\D/g, '');

  if (digits.length === 13 && digits.startsWith('55')) {
    digits = digits.slice(2);
  }
  if (digits.length === 10) {
    digits = `${digits.slice(0, 2)}9${digits.slice(2)}`;
  }

  return formatTelefoneInput(digits);
}

export function telefoneCelularValido(value) {
  const digits = String(value ?? '').replace(/\D/g, '');
  return digits.length === 11 && digits[2] === '9';
}

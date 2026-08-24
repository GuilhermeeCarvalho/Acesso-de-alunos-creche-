function normalizeText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

function mapFieldMessage(field, message) {
  const fieldName = normalizeText(field)
    .replace(/_/g, ' ')
    .toLowerCase();
  const text = normalizeText(message);

  if (!text) return '';

  if (fieldName.includes('telefone')) {
    return 'Telefone inválido. Use o formato (47) 99999-9999 ou 47999999999.';
  }

  if (fieldName.includes('nome')) {
    if (text.toLowerCase().includes('já existe') || text.toLowerCase().includes('ja existe')) {
      return 'Este nome já está cadastrado. Use outro nome para continuar.';
    }
    return 'Nome inválido. Verifique se foi preenchido corretamente.';
  }

  if (fieldName.includes('email')) {
    if (text.toLowerCase().includes('já existe') || text.toLowerCase().includes('ja existe')) {
      return 'Este e-mail já está cadastrado. Use outro endereço para continuar.';
    }
    return 'E-mail inválido. Verifique o endereço informado.';
  }

  if (text.toLowerCase().includes('já existe') || text.toLowerCase().includes('ja existe')) {
    return 'Já existe um cadastro com esse valor. Verifique e tente outro.';
  }

  return text;
}

export function formatApiError(err, fallback = 'Não foi possível concluir a operação. Verifique os dados e tente novamente.') {
  const data = err?.response?.data;
  const payload = data ?? {};

  const fieldMessages = Object.entries(payload.erros || {})
    .map(([field, message]) => mapFieldMessage(field, Array.isArray(message) ? message.join(' ') : message))
    .filter(Boolean);

  if (fieldMessages.length > 0) {
    return [...new Set(fieldMessages)].join(' ');
  }

  const directMessage = normalizeText(
    payload.mensagem ||
    payload.message ||
    payload.error ||
    err?.message ||
    ''
  );

  if (!directMessage) {
    return fallback;
  }

  const lowerMess = directMessage.toLowerCase();

  if (lowerMess.includes('já existe') || lowerMess.includes('ja existe')) {
    return 'Já existe um cadastro com esse valor. Verifique e tente outro.';
  }

  if (lowerMess.includes('telefone')) {
    return 'Telefone inválido. Use o formato (47) 99999-9999 ou 47999999999.';
  }

  if (lowerMess.includes('email')) {
    return 'Este e-mail já está cadastrado. Use outro endereço para continuar.';
  }

  if (lowerMess.includes('senha')) {
    return 'A senha informada não foi aceita. Verifique o valor e tente novamente.';
  }

  return directMessage;
}

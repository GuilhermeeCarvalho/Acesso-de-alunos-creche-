function parseHorario(horario) {
  if (typeof horario !== 'string') {
    return null;
  }

  const match = horario.match(/^(\d{2}):(\d{2})-(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  return {
    inicio: Number(match[1]) * 60 + Number(match[2]),
    fim: Number(match[3]) * 60 + Number(match[4]),
  };
}

function obterMinutosDoRegistro(dataHora) {
  if (typeof dataHora === 'string') {
    const match = dataHora.match(/T(\d{2}):(\d{2})/);
    if (match) {
      return Number(match[1]) * 60 + Number(match[2]);
    }
  }

  const data = new Date(dataHora);
  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return data.getHours() * 60 + data.getMinutes();
}

export function registroForaDoHorario(registro) {
  const minutos = obterMinutosDoRegistro(registro.dataHoraOriginal);
  if (minutos === null) {
    return false;
  }

  const tipo = String(registro.tipo || '').replaceAll('_', ' ').toUpperCase();
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA' && tipo !== 'SAÍDA') {
    return false;
  }

  const faixaPlantaoAplicavel = registro.precisaPlantao
    && ((tipo === 'ENTRADA' && registro.plantaoTurno === 'Matutino')
      || ((tipo === 'SAIDA' || tipo === 'SAÍDA') && registro.plantaoTurno === 'Vespertino'))
    ? parseHorario(registro.horarioPlantao)
    : null;

  if (faixaPlantaoAplicavel) {
    return minutos < faixaPlantaoAplicavel.inicio || minutos > faixaPlantaoAplicavel.fim;
  }

  const horarioNormal = tipo === 'ENTRADA' ? 8 * 60 + 15 : 16 * 60 + 15;
  return minutos !== horarioNormal;
}

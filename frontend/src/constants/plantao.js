export const turmasComHorarioPlantao = [
  'Berçário',
  'Maternal IA',
  'Maternal IB',
  'Maternal IIA',
  'Maternal IIB',
  'Maternal IIC',
  'Maternal IID',
  'Maternal IIE',
  'Maternal IIF',
  'PRÉ IA',
  'PRÉ IB',
  'PRÉ IC',
  'PRÉ IIA',
  'PRÉ IIB',
  'PRÉ IIC',
];

export const horariosPlantao = {
  Matutino: [
    { value: '06:30-07:00', label: '06:30 até 07:00' },
    { value: '07:00-07:30', label: '07:00 até 07:30' },
    { value: '07:30-08:15', label: '07:30 até 08:15' },
  ],
  Vespertino: [
    { value: '16:15-16:45', label: '16:15 até 16:45' },
    { value: '16:45-17:30', label: '16:45 até 17:30' },
  ],
};

const turmasPre = ['PRÉ IA', 'PRÉ IB', 'PRÉ IC', 'PRÉ IIA', 'PRÉ IIB', 'PRÉ IIC'];

export function horariosPlantaoParaTurma(turma, turno) {
  if (turno === 'Matutino' && turmasPre.includes(turma)) {
    return horariosPlantao.Matutino.filter((horario) => horario.value !== '06:30-07:00');
  }

  return horariosPlantao[turno] || [];
}

export function turmaTemHorarioPlantao(turma) {
  return turmasComHorarioPlantao.includes(turma);
}

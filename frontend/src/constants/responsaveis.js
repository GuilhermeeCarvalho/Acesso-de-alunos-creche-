export const relacaoResponsavelOptions = [
  { value: 'PAI', label: 'Pai' },
  { value: 'MAE', label: 'Mãe' },
  { value: 'IRMAO', label: 'Irmã(o)' },
  { value: 'TIO', label: 'Tio(a)' },
  { value: 'AVO', label: 'Avô(ó)' },
  { value: 'RESPONSAVEL_LEGAL', label: 'Responsável Legal' },
];

export const relacaoResponsavelLabels = Object.fromEntries(
  relacaoResponsavelOptions.map(({ value, label }) => [value, label])
);

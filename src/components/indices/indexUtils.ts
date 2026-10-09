export const parseIndexNumber = (value: number | string): number =>
  Number.parseFloat(String(value).trim().replace(',', '.'));

export const normalizeIndexLabel = (value: number | string): string =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('pt-BR');

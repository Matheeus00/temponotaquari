export interface Holiday {
  name: string;
  scope: 'Brasil' | 'Rio Grande do Sul' | 'Municipal';
  type?: 'optional';
}

const MUNICIPAL_HOLIDAYS: Record<string, Record<string, Holiday>> = {
  'anta-gorda': {
    '07-25': { name: 'Dia de São Cristóvão (Colono e Motorista)', scope: 'Municipal' },
    '11-04': { name: 'Dia de São Carlos Borromeu (Padroeiro)', scope: 'Municipal' },
    '12-26': { name: 'Aniversário de Anta Gorda', scope: 'Municipal' },
  },
  'arroio-do-meio': {
    '11-28': { name: 'Aniversário de Arroio do Meio', scope: 'Municipal' },
  },
  arvorezinha: {
    '02-16': { name: 'Aniversário de Arvorezinha (Santo Onésimo)', scope: 'Municipal' },
    '06-24': { name: 'Dia de São João Batista (Padroeiro)', scope: 'Municipal' },
  },
  'bom-retiro-do-sul': {
    '06-01': { name: 'Aniversário de Bom Retiro do Sul', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  'boqueirao-do-leao': {
    '07-25': { name: 'Dia do Colono e Motorista', scope: 'Municipal' },
    '12-08': { name: 'Aniversário de Boqueirão do Leão / Imaculada Conceição', scope: 'Municipal' },
  },
  colinas: {
    '03-20': { name: 'Aniversário de Colinas', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  'cruzeiro-do-sul': {
    '11-22': { name: 'Aniversário de Cruzeiro do Sul', scope: 'Municipal' },
  },
  encantado: {
    '11-22': { name: 'Dia de Santa Cecília (Padroeira)', scope: 'Municipal' },
  },
  estrela: {
    '05-20': { name: 'Aniversário de Estrela', scope: 'Municipal' },
    '05-21': { name: 'Dia de São Cristóvão (Padroeiro)', scope: 'Municipal' },
  },
  'fazenda-vilanova': {
    '10-22': { name: 'Aniversário de Fazenda Vilanova', scope: 'Municipal' },
  },
  ilopolis: {
    '12-26': { name: 'Aniversário de Ilópolis', scope: 'Municipal' },
  },
  imigrante: {
    '05-09': { name: 'Aniversário de Imigrante', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  lajeado: {
    '01-26': {
      name: 'Aniversário de Lajeado',
      scope: 'Municipal',
      type: 'optional',
    },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  'marques-de-souza': {
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
    '12-28': { name: 'Aniversário de Marques de Souza', scope: 'Municipal' },
  },
  mucum: {
    '05-31': { name: 'Aniversário de Muçum', scope: 'Municipal' },
  },
  'nova-brescia': {
    '06-24': { name: 'Dia de São João Batista (Padroeiro)', scope: 'Municipal' },
  },
  paverama: {
    '04-13': { name: 'Aniversário de Paverama', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  progresso: {
    '11-30': { name: 'Aniversário de Progresso', scope: 'Municipal' },
  },
  putinga: {
    '12-26': { name: 'Aniversário de Putinga', scope: 'Municipal' },
  },
  'roca-sales': {
    '12-18': { name: 'Aniversário de Roca Sales', scope: 'Municipal' },
  },
  'santa-clara-do-sul': {
    '03-20': { name: 'Aniversário de Santa Clara do Sul', scope: 'Municipal' },
    '04-16': { name: 'Dia de São Martinho (Padroeiro)', scope: 'Municipal' },
  },
  taquari: {
    '03-19': { name: 'Dia de São José (Padroeiro)', scope: 'Municipal' },
    '07-04': { name: 'Aniversário de Taquari', scope: 'Municipal' },
  },
  teutonia: {
    '05-24': { name: 'Aniversário de Teutônia', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
  'venancio-aires': {
    '01-20': { name: 'Dia de São Sebastião Mártir (Padroeiro)', scope: 'Municipal' },
    '05-11': { name: 'Aniversário de Venâncio Aires', scope: 'Municipal' },
    '07-25': { name: 'Dia do Colono e Motorista', scope: 'Municipal' },
  },
  westfalia: {
    '04-16': { name: 'Aniversário de Westfália', scope: 'Municipal' },
    '10-31': { name: 'Dia da Reforma Protestante', scope: 'Municipal' },
  },
};

export const getHolidayScopeLabel = (scope: Holiday['scope']): string => {
  if (scope === 'Brasil') return 'nacional';
  if (scope === 'Rio Grande do Sul') return 'estadual';
  return 'municipal';
};

export const getHolidayTypeLabel = (holiday: Holiday): string =>
  holiday.type === 'optional' ? 'Ponto facultativo' : 'Feriado';

const getEasterDate = (year: number): { month: number; day: number } => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
};

const getGoodFridayDateKey = (year: number): string => {
  const easter = getEasterDate(year);
  const date = new Date(Date.UTC(year, easter.month - 1, easter.day - 2));
  return date.toISOString().slice(0, 10);
};

export const getHolidayForDate = (dateKey: string, cityId?: string): Holiday | undefined => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return undefined;

  const year = Number(dateKey.slice(0, 4));
  const monthDay = dateKey.slice(5);
  const fixedHolidays: Record<string, Holiday> = {
    '01-01': { name: 'Confraternização Universal', scope: 'Brasil' },
    '04-21': { name: 'Tiradentes', scope: 'Brasil' },
    '05-01': { name: 'Dia Mundial do Trabalho', scope: 'Brasil' },
    '09-07': { name: 'Independência do Brasil', scope: 'Brasil' },
    '09-20': {
      name: 'Revolução Farroupilha (Data Magna Estadual)',
      scope: 'Rio Grande do Sul',
    },
    '10-12': { name: 'Nossa Senhora Aparecida', scope: 'Brasil' },
    '11-02': { name: 'Finados', scope: 'Brasil' },
    '11-15': { name: 'Proclamação da República', scope: 'Brasil' },
    '11-20': { name: 'Dia Nacional de Zumbi e da Consciência Negra', scope: 'Brasil' },
    '12-25': { name: 'Natal', scope: 'Brasil' },
  };

  if (dateKey === getGoodFridayDateKey(year)) {
    return { name: 'Sexta-feira Santa', scope: 'Brasil' };
  }

  return fixedHolidays[monthDay] ?? MUNICIPAL_HOLIDAYS[cityId ?? '']?.[monthDay];
};

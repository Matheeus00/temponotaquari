export interface Holiday {
  name: string;
  scope: 'Brasil' | 'Rio Grande do Sul';
}

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

export const getHolidayForDate = (dateKey: string): Holiday | undefined => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) return undefined;

  const year = Number(dateKey.slice(0, 4));
  const monthDay = dateKey.slice(5);
  const fixedHolidays: Record<string, Holiday> = {
    '01-01': { name: 'Confraternização Universal', scope: 'Brasil' },
    '04-21': { name: 'Tiradentes', scope: 'Brasil' },
    '05-01': { name: 'Dia Mundial do Trabalho', scope: 'Brasil' },
    '09-07': { name: 'Independência do Brasil', scope: 'Brasil' },
    '09-20': { name: 'Revolução Farroupilha', scope: 'Rio Grande do Sul' },
    '10-12': { name: 'Nossa Senhora Aparecida', scope: 'Brasil' },
    '11-02': { name: 'Finados', scope: 'Brasil' },
    '11-15': { name: 'Proclamação da República', scope: 'Brasil' },
    '11-20': { name: 'Dia Nacional de Zumbi e da Consciência Negra', scope: 'Brasil' },
    '12-25': { name: 'Natal', scope: 'Brasil' },
  };

  if (dateKey === getGoodFridayDateKey(year)) {
    return { name: 'Sexta-feira Santa', scope: 'Brasil' };
  }

  return fixedHolidays[monthDay];
};

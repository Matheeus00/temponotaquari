export interface BeaufortLevel {
  force: number;
  minSpeed: number;
  maxSpeed: number | null;
  description: string;
  effect: string;
}

export const BEAUFORT_SCALE: BeaufortLevel[] = [
  { force: 0, minSpeed: 0, maxSpeed: 0.9, description: 'Calmaria', effect: 'A fumaça sobe verticalmente.' },
  { force: 1, minSpeed: 1, maxSpeed: 5, description: 'Aragem', effect: 'A fumaça indica a direção do vento.' },
  { force: 2, minSpeed: 6, maxSpeed: 11, description: 'Brisa leve', effect: 'O vento é sentido no rosto; folhas se movem.' },
  { force: 3, minSpeed: 12, maxSpeed: 19, description: 'Brisa fraca', effect: 'Folhas e pequenos galhos estão em movimento.' },
  { force: 4, minSpeed: 20, maxSpeed: 28, description: 'Brisa moderada', effect: 'Poeira e papéis leves são levantados.' },
  { force: 5, minSpeed: 29, maxSpeed: 38, description: 'Brisa forte', effect: 'Pequenas árvores começam a balançar.' },
  { force: 6, minSpeed: 39, maxSpeed: 49, description: 'Vento forte', effect: 'Galhos grandes se movem; fica difícil usar guarda-chuva.' },
  { force: 7, minSpeed: 50, maxSpeed: 61, description: 'Vento muito forte', effect: 'Árvores inteiras se movimentam.' },
  { force: 8, minSpeed: 62, maxSpeed: 74, description: 'Ventania', effect: 'Galhos podem se quebrar.' },
  { force: 9, minSpeed: 75, maxSpeed: 88, description: 'Ventania forte', effect: 'Podem ocorrer danos leves em construções.' },
  { force: 10, minSpeed: 89, maxSpeed: 102, description: 'Tempestade', effect: 'Árvores podem ser derrubadas; danos são possíveis.' },
  { force: 11, minSpeed: 103, maxSpeed: 117, description: 'Tempestade violenta', effect: 'Danos extensos são possíveis; ocorrência rara em terra.' },
  { force: 12, minSpeed: 118, maxSpeed: null, description: 'Furacão', effect: 'Ventos extremamente destrutivos.' },
];

export const getBeaufortLevel = (speed: number): BeaufortLevel => (
  [...BEAUFORT_SCALE].reverse().find((level) => speed >= level.minSpeed) ?? BEAUFORT_SCALE[0]
);

export const TAQUARI_VALLEY_CITIES = [
  { id: 'anta-gorda', name: 'Anta Gorda', latitude: -28.97028, longitude: -52.00472 },
  { id: 'arroio-do-meio', name: 'Arroio do Meio', latitude: -29.40111, longitude: -51.945 },
  { id: 'arvorezinha', name: 'Arvorezinha', latitude: -28.87222, longitude: -52.17528 },
  { id: 'bom-retiro-do-sul', name: 'Bom Retiro do Sul', latitude: -29.60889, longitude: -51.94306 },
  { id: 'boqueirao-do-leao', name: 'Boqueirão do Leão', latitude: -29.30389, longitude: -52.42944 },
  { id: 'colinas', name: 'Colinas', latitude: -29.38933, longitude: -51.86929 },
  { id: 'cruzeiro-do-sul', name: 'Cruzeiro do Sul', latitude: -29.51278, longitude: -51.98528 },
  { id: 'encantado', name: 'Encantado', latitude: -29.23611, longitude: -51.86972 },
  { id: 'estrela', name: 'Estrela', latitude: -29.50194, longitude: -51.96639 },
  { id: 'fazenda-vilanova', name: 'Fazenda Vilanova', latitude: -29.58944, longitude: -51.825 },
  { id: 'ilopolis', name: 'Ilópolis', latitude: -28.92667, longitude: -52.12417 },
  { id: 'imigrante', name: 'Imigrante', latitude: -29.35442, longitude: -51.77786 },
  { id: 'lajeado', name: 'Lajeado', latitude: -29.46694, longitude: -51.96139 },
  { id: 'marques-de-souza', name: 'Marques de Souza', latitude: -29.3275, longitude: -52.0925 },
  { id: 'mucum', name: 'Muçum', latitude: -29.16472, longitude: -51.86778 },
  { id: 'nova-brescia', name: 'Nova Bréscia', latitude: -29.21444, longitude: -52.0275 },
  { id: 'paverama', name: 'Paverama', latitude: -29.55167, longitude: -51.73028 },
  { id: 'progresso', name: 'Progresso', latitude: -29.24417, longitude: -52.31222 },
  { id: 'putinga', name: 'Putinga', latitude: -29.00194, longitude: -52.15417 },
  { id: 'roca-sales', name: 'Roca Sales', latitude: -29.28417, longitude: -51.8675 },
  { id: 'santa-clara-do-sul', name: 'Santa Clara do Sul', latitude: -29.46889, longitude: -52.0875 },
  { id: 'taquari', name: 'Taquari', latitude: -29.79972, longitude: -51.86444 },
  { id: 'teutonia', name: 'Teutônia', latitude: -29.44806, longitude: -51.80639 },
  { id: 'venancio-aires', name: 'Venâncio Aires', latitude: -29.60639, longitude: -52.19194 },
  { id: 'westfalia', name: 'Westfália', latitude: -29.42839, longitude: -51.76604 },
] as const;

export function getTaquariValleyCity(id: string | null | undefined) {
  return TAQUARI_VALLEY_CITIES.find((city) => city.id === id);
}

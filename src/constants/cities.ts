export const TAQUARI_VALLEY_CITIES = [
  { id: 'lajeado', name: 'Lajeado' },
  { id: 'estrela', name: 'Estrela' },
  { id: 'teutonia', name: 'Teutônia' },
  { id: 'taquari', name: 'Taquari' },
  { id: 'arroio-do-meio', name: 'Arroio do Meio' },
  { id: 'encantado', name: 'Encantado' },
  { id: 'venancio-aires', name: 'Venâncio Aires' },
  { id: 'bom-retiro-do-sul', name: 'Bom Retiro do Sul' },
  { id: 'cruzeiro-do-sul', name: 'Cruzeiro do Sul' },
  { id: 'roca-sales', name: 'Roca Sales' },
  { id: 'arvorezinha', name: 'Arvorezinha' },
  { id: 'progresso', name: 'Progresso' },
  { id: 'paverama', name: 'Paverama' },
  { id: 'boqueirao-do-leao', name: 'Boqueirão do Leão' },
  { id: 'anta-gorda', name: 'Anta Gorda' },
  { id: 'santa-clara-do-sul', name: 'Santa Clara do Sul' },
  { id: 'mucum', name: 'Muçum' },
  { id: 'marques-de-souza', name: 'Marques de Souza' },
  { id: 'fazenda-vilanova', name: 'Fazenda Vilanova' },
  { id: 'putinga', name: 'Putinga' },
  { id: 'ilopolis', name: 'Ilópolis' },
  { id: 'nova-brescia', name: 'Nova Bréscia' },
  { id: 'colinas', name: 'Colinas' },
  { id: 'imigrante', name: 'Imigrante' },
  { id: 'westfalia', name: 'Westfália' },
] as const;

export function getTaquariValleyCity(id: string | null | undefined) {
  return TAQUARI_VALLEY_CITIES.find((city) => city.id === id);
}

export const TAQUARI_VALLEY_CITIES = [
  { id: 'anta-gorda', name: 'Anta Gorda' },
  { id: 'arroio-do-meio', name: 'Arroio do Meio' },
  { id: 'arvorezinha', name: 'Arvorezinha' },
  { id: 'bom-retiro-do-sul', name: 'Bom Retiro do Sul' },
  { id: 'boqueirao-do-leao', name: 'Boqueirão do Leão' },
  { id: 'colinas', name: 'Colinas' },
  { id: 'cruzeiro-do-sul', name: 'Cruzeiro do Sul' },
  { id: 'encantado', name: 'Encantado' },
  { id: 'estrela', name: 'Estrela' },
  { id: 'fazenda-vilanova', name: 'Fazenda Vilanova' },
  { id: 'ilopolis', name: 'Ilópolis' },
  { id: 'imigrante', name: 'Imigrante' },
  { id: 'lajeado', name: 'Lajeado' },
  { id: 'marques-de-souza', name: 'Marques de Souza' },
  { id: 'mucum', name: 'Muçum' },
  { id: 'nova-brescia', name: 'Nova Bréscia' },
  { id: 'paverama', name: 'Paverama' },
  { id: 'progresso', name: 'Progresso' },
  { id: 'putinga', name: 'Putinga' },
  { id: 'roca-sales', name: 'Roca Sales' },
  { id: 'santa-clara-do-sul', name: 'Santa Clara do Sul' },
  { id: 'taquari', name: 'Taquari' },
  { id: 'teutonia', name: 'Teutônia' },
  { id: 'venancio-aires', name: 'Venâncio Aires' },
  { id: 'westfalia', name: 'Westfália' },
] as const;

export function getTaquariValleyCity(id: string | null | undefined) {
  return TAQUARI_VALLEY_CITIES.find((city) => city.id === id);
}

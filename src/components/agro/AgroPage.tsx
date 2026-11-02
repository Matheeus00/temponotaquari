import './AgroPage.css';
import { TAQUARI_VALLEY_CITIES } from '../../constants/cities';

const agroTopics = [
  {
    title: 'Estiagem',
    description: 'Acompanhamento de períodos secos e da disponibilidade de chuva na região.',
  },
  {
    title: 'Fogo',
    description: 'Informações sobre risco de fogo e focos detectados, apresentados separadamente.',
  },
  {
    title: 'Geada',
    description: 'Condições meteorológicas que podem favorecer a ocorrência de geada.',
  },
  {
    title: 'Chuva',
    description: 'Previsão e informações de chuva relevantes para o planejamento no campo.',
  },
  {
    title: 'Calor',
    description: 'Acompanhamento de períodos de calor intenso e condições associadas.',
  },
  {
    title: 'Vento',
    description: 'Informações de vento para apoiar o acompanhamento das condições meteorológicas.',
  },
];

const MAP_BOUNDS = {
  minLatitude: -29.9,
  maxLatitude: -28.7,
  minLongitude: -52.5,
  maxLongitude: -51.6,
};

const getMapPosition = (latitude: number, longitude: number) => ({
  x: 28 + ((longitude - MAP_BOUNDS.minLongitude)
    / (MAP_BOUNDS.maxLongitude - MAP_BOUNDS.minLongitude)) * 584,
  y: 28 + ((MAP_BOUNDS.maxLatitude - latitude)
    / (MAP_BOUNDS.maxLatitude - MAP_BOUNDS.minLatitude)) * 364,
});

interface AgroPageProps {
  selectedCityId: string;
}

export const AgroPage = ({ selectedCityId }: AgroPageProps) => {
  const selectedCity = TAQUARI_VALLEY_CITIES.find((city) => city.id === selectedCityId);

  return (
  <div className="agro-page" aria-labelledby="agro-title">
    <header className="agro-intro">
      <p className="eyebrow">TEMPO E CONDIÇÕES NO CAMPO</p>
      <h1 id="agro-title">Agro</h1>
      <p>
        Uma área dedicada a informações meteorológicas de interesse para o campo no
        Vale do Taquari.
      </p>
      <div className="agro-notice" role="status">
        <span className="agro-notice-mark" aria-hidden="true">i</span>
        <p>
          Estamos avaliando fontes e formas de apresentar esses temas. Ainda não há
          dados ou recomendações agrícolas disponíveis nesta área.
        </p>
      </div>
    </header>

    <section className="agro-map-section" aria-labelledby="agro-map-title">
      <div className="agro-map-heading">
        <div>
          <p className="eyebrow">LOCALIZAÇÃO</p>
          <h2 id="agro-map-title">Municípios do Vale do Taquari</h2>
        </div>
        <span className="agro-map-count">{TAQUARI_VALLEY_CITIES.length} municípios</span>
      </div>
      <div className="agro-map" role="img" aria-labelledby="agro-map-title agro-map-description">
        <svg viewBox="0 0 640 420" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <defs>
            <pattern id="agro-map-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M32 0H0V32" fill="none" stroke="currentColor" strokeOpacity=".08" />
            </pattern>
          </defs>
          <rect width="640" height="420" fill="url(#agro-map-grid)" />
          {TAQUARI_VALLEY_CITIES.map((city) => {
            const position = getMapPosition(city.latitude, city.longitude);
            const isSelected = city.id === selectedCityId;

            return (
              <g
                key={city.id}
                className={isSelected ? 'agro-map-marker agro-map-marker-selected' : 'agro-map-marker'}
                transform={`translate(${position.x} ${position.y})`}
              >
                <title>{city.name}{isSelected ? ' · cidade selecionada' : ''}</title>
                {isSelected && <circle className="agro-map-marker-halo" r="13" />}
                <circle className="agro-map-marker-dot" r={isSelected ? 6 : 4} />
              </g>
            );
          })}
        </svg>
        <p id="agro-map-description" className="agro-map-caption">
          {selectedCity
            ? `Localização esquemática das sedes municipais. Cidade selecionada: ${selectedCity.name}.`
            : 'Localização esquemática das sedes municipais do Vale do Taquari.'}
        </p>
      </div>
      <p className="agro-map-disclaimer">
        Mapa esquemático com marcadores nas sedes municipais. Não representa limites
        territoriais nem exibe dados ambientais.
      </p>
    </section>

    <section className="agro-topics" aria-labelledby="agro-topics-title">
      <div className="agro-topics-heading">
        <div>
          <p className="eyebrow">TEMAS EM PLANEJAMENTO</p>
          <h2 id="agro-topics-title">O que queremos acompanhar</h2>
        </div>
      </div>
      <div className="agro-topic-grid">
        {agroTopics.map((topic) => (
          <article className="agro-topic-card" key={topic.title}>
            <span className="agro-topic-status">Em breve</span>
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
          </article>
        ))}
      </div>
    </section>
  </div>
  );
};

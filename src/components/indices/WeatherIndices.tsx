import type { ForecastDay, WeatherIndicesData } from '../../types';
import { BarbecueIndex } from './BarbecueIndex';
import { ColdIndex } from './ColdIndex';
import { FrizzIndex } from './FrizzIndex';
import { MosquitoIndex } from './MosquitoIndex';
import { SkinDrynessIndex } from './SkinDrynessIndex';
import { VitaminDIndex } from './VitaminDIndex';
import './WeatherIndices.css';

interface WeatherIndicesProps {
  data?: WeatherIndicesData;
  humidity: number | string;
  temperature: number | string;
  cloudiness: number | string;
  forecast: ForecastDay[];
  uvIndex?: number;
}

export const WeatherIndices = ({
  data,
  humidity,
  temperature,
  cloudiness,
  forecast,
  uvIndex,
}: WeatherIndicesProps) => (
  <section className="weather-indices-section" aria-labelledby="weather-indices-title">
    <div className="section-heading">
      <div>
        <p className="eyebrow">ÍNDICES DO TEMPO</p>
        <h2 id="weather-indices-title">O tempo no seu dia a dia</h2>
      </div>
    </div>
    <div className="weather-indices-grid">
      <BarbecueIndex data={data?.barbecue} cloudiness={cloudiness} forecast={forecast} />
      <MosquitoIndex data={data?.mosquito} temperature={temperature} forecast={forecast} />
      <FrizzIndex data={data?.frizz} humidity={humidity} />
      <SkinDrynessIndex data={data?.['skin-dryness']} humidity={humidity} forecast={forecast} />
      <ColdIndex data={data?.cold} humidity={humidity} temperature={temperature} />
      <VitaminDIndex data={data?.['vitamin-d']} uvIndex={uvIndex} />
    </div>
  </section>
);

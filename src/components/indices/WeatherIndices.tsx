import type { ForecastDay, HourlyForecast, UvIndexData, WeatherIndicesData } from '../../types';
import { BarbecueIndex } from './BarbecueIndex';
import { ColdIndex } from './ColdIndex';
import { ClothesDryingIndex } from './ClothesDryingIndex';
import { FrizzIndex } from './FrizzIndex';
import { MosquitoIndex } from './MosquitoIndex';
import { SkinDrynessIndex } from './SkinDrynessIndex';
import { VitaminDIndex } from './VitaminDIndex';
import type { TemperatureUnit } from '../../utils/utils';
import './WeatherIndices.css';

interface WeatherIndicesProps {
  data?: WeatherIndicesData;
  humidity: number | string;
  temperature: number | string;
  cloudiness: number | string;
  forecast: ForecastDay[];
  todayForecast?: ForecastDay;
  hourlyForecast: HourlyForecast[];
  selectedDate: string | null;
  periodLabel: string;
  uvForecast?: UvIndexData;
  temperatureUnit: TemperatureUnit;
}

export const WeatherIndices = ({
  data,
  humidity,
  temperature,
  cloudiness,
  forecast,
  todayForecast,
  hourlyForecast,
  selectedDate,
  periodLabel,
  uvForecast,
  temperatureUnit,
}: WeatherIndicesProps) => {
  const selectedDayHours = selectedDate
    ? hourlyForecast.filter((hour) => hour.time.slice(0, 10) === selectedDate)
    : [];
  const average = (values: number[]) =>
    values.length > 0
      ? values.reduce((total, value) => total + value, 0) / values.length
      : Number.NaN;
  const selectedDayForecast: ForecastDay | undefined = selectedDayHours.length > 0
    ? {
      date: selectedDate ?? '',
      weekday: selectedDate ?? '',
      max: Math.max(...selectedDayHours.map((hour) => hour.temperature)),
      min: Math.min(...selectedDayHours.map((hour) => hour.temperature)),
      rain_probability: Math.max(...selectedDayHours.map((hour) => hour.precipitationProbability)),
    }
    : undefined;
  const indexForecast = selectedDate
    ? (selectedDayForecast ? [selectedDayForecast] : [])
    : forecast;
  const indexData = selectedDate ? undefined : data;
  const indexHumidity = selectedDate
    ? average(selectedDayHours.map((hour) => hour.humidity))
    : humidity;
  const indexTemperature = selectedDate
    ? average(selectedDayHours.map((hour) => hour.temperature))
    : temperature;
  const indexCloudiness = selectedDate
    ? average(selectedDayHours.map((hour) => hour.cloudCover))
    : cloudiness;
  const indexUv = selectedDate
    ? uvForecast?.dailyForecast?.find((day) => day.date === selectedDate)?.dailyMax
    : uvForecast?.dailyMax ?? uvForecast?.index;

  return (
    <section className="weather-indices-section" aria-labelledby="weather-indices-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">ÍNDICES DO TEMPO</p>
          <h2 id="weather-indices-title">O tempo no seu dia a dia</h2>
        </div>
      </div>
      <div className="weather-indices-grid">
        <BarbecueIndex
          cloudiness={indexCloudiness}
          todayForecast={selectedDate ? selectedDayForecast : todayForecast}
          temperatureUnit={temperatureUnit}
        />
        <MosquitoIndex
          data={indexData?.mosquito}
          temperature={indexTemperature}
          forecast={indexForecast}
          temperatureUnit={temperatureUnit}
        />
        <FrizzIndex data={indexData?.frizz} humidity={indexHumidity} />
        <SkinDrynessIndex
          data={indexData?.['skin-dryness']}
          humidity={indexHumidity}
          forecast={indexForecast}
        />
        <ColdIndex
          data={indexData?.cold}
          humidity={indexHumidity}
          temperature={indexTemperature}
          temperatureUnit={temperatureUnit}
        />
        <VitaminDIndex data={indexData?.['vitamin-d']} uvIndex={indexUv} />
        <ClothesDryingIndex forecast={hourlyForecast} periodLabel={periodLabel} />
      </div>
    </section>
  );
};

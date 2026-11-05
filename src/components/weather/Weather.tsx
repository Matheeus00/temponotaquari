import {
    formatTemperature,
    calculateApparentTemperature,
    getImageSource,
    getTemperatureUnitLabel,
    to24Hours,
    type TemperatureUnit,
} from '../../utils/utils';
import './Weather.css';

interface WeatherProps {
    code: number;
    temp: number | string;
    temperatureUnit: TemperatureUnit;
    time: 'day' | 'night';
    sunrise: string;
    sunset: string;
    description: string;
    humidity: number | string;
    windSpeed: string;
    rain: number | string;
    cloudiness: number | string;
    rainProbabilityNextSixHours: number | null;
}

interface WeatherAdviceProps {
    temp: number | string;
    temperatureUnit: TemperatureUnit;
    humidity: number | string;
    windSpeed: string;
    rain: number | string;
    rainProbabilityNextSixHours: number | null;
    uvIndex?: number;
}

const getWeatherAdvice = ({
    temp,
    temperatureUnit,
    humidity,
    windSpeed,
    rain,
    rainProbabilityNextSixHours,
    uvIndex,
}: WeatherAdviceProps): string[] => {
    const apparentTemperature = calculateApparentTemperature(temp, humidity, windSpeed);
    const advice: string[] = [];

    if (typeof uvIndex === 'number' && Number.isFinite(uvIndex) && uvIndex >= 3) {
        advice.push('Passe protetor solar: o índice UV pede proteção.');
    }
    if (apparentTemperature !== null && apparentTemperature <= 16) {
        advice.push(
            `Leve um casaco: sensação térmica de ${formatTemperature(apparentTemperature, temperatureUnit)}${getTemperatureUnitLabel(temperatureUnit)}.`,
        );
    }
    if (
        (typeof rainProbabilityNextSixHours === 'number' && rainProbabilityNextSixHours >= 40)
        || Number.parseFloat(String(rain).trim().replace(',', '.')) >= 0.1
    ) {
        advice.push('Leve guarda-chuva: há previsão de chuva nas próximas horas.');
    }
    if (apparentTemperature !== null && apparentTemperature >= 30) {
        advice.push('Beba água e prefira locais com sombra.');
    }

    return advice;
};

export const WeatherAdvice = (props: WeatherAdviceProps) => {
    const advice = getWeatherAdvice(props);

    return (
        <div className="weather-advice" aria-label="Dicas para agora">
            <span className="weather-advice-icon" aria-hidden="true">
                <img src="/condition/weather-alert.svg" alt="" />
            </span>
            <div>
                <p className="weather-advice-label">DICA PARA AGORA</p>
                <p className="weather-advice-message">
                    {advice.length > 0 ? advice.join(' ') : 'Condições tranquilas para aproveitar o dia.'}
                </p>
            </div>
        </div>
    );
};

export const Weather = ({
    code,
    temp,
    temperatureUnit,
    time,
    sunrise,
    sunset,
    description,
    humidity,
    windSpeed,
    rain,
    cloudiness,
    rainProbabilityNextSixHours,
}: WeatherProps) => {
    const apparentTemperature = calculateApparentTemperature(temp, humidity, windSpeed);

    return (
        <div className="weather-container">
            <div className='weather-header'>
                <img className='weather-condition' src={getImageSource(time, code)} alt=''/>
                <div className="temperature-block">
                    <p className="weather-kicker">AGORA</p>
                    <div className="temperature">
                        <span className='weather-temp'>{formatTemperature(temp, temperatureUnit)}</span>
                        <span className="temperature-unit">{getTemperatureUnitLabel(temperatureUnit)}</span>
                    </div>
                    <p className='weather-description'>{description}</p>
                    {apparentTemperature !== null && (
                        <p className="apparent-temperature">
                            Sensação térmica: {formatTemperature(apparentTemperature, temperatureUnit)}
                            {getTemperatureUnitLabel(temperatureUnit)}
                        </p>
                    )}
                </div>
            </div>
            <div className="weather-metrics">
                <div className="weather-metric">
                    <span className="metric-icon"><img src='/condition/humidity.svg' alt=''/></span>
                    <span className="metric-copy"><span>Umidade</span><strong>{humidity}%</strong></span>
                </div>
                <div className="weather-metric">
                    <span className="metric-icon"><img src='/condition/raindrop-measure.svg' alt=''/></span>
                    <span className="metric-copy"><span>Chuva</span><strong>{rain} mm</strong></span>
                </div>
                <div className="weather-metric">
                    <span className="metric-icon"><img src='/condition/cloudy.svg' alt=''/></span>
                    <span className="metric-copy"><span>Nebulosidade</span><strong>{cloudiness}%</strong></span>
                </div>
                <div
                    className="weather-metric"
                    title="Maior chance de chuva prevista nas próximas 6 horas"
                >
                    <span className="metric-icon"><img src='/forecast/raindrops.svg' alt=''/></span>
                    <span className="metric-copy">
                        <span>Chance nas próximas 6h</span>
                        <strong>{rainProbabilityNextSixHours === null ? '—' : `${rainProbabilityNextSixHours}%`}</strong>
                    </span>
                </div>
            </div>
            <div className='weather-body'>
                <div className='sun-time' title='Nascer do Sol'>
                    <img src='/condition/sunrise.svg' alt=''/>
                    <span><small>Nascer do sol</small><strong>{to24Hours(sunrise)}</strong></span>
                </div>
                <div className='sun-time' title='Pôr do Sol'>
                    <img src='/condition/sunset.svg' alt=''/>
                    <span><small>Pôr do sol</small><strong>{to24Hours(sunset)}</strong></span>
                </div>
            </div>
        </div>
    );
};
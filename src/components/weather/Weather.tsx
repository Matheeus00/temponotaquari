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
    time: 'day' | 'night';
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
    time,
}: WeatherAdviceProps): Array<{ message: string; icon: string }> => {
    const apparentTemperature = calculateApparentTemperature(temp, humidity, windSpeed);
    const advice: Array<{ message: string; icon: string }> = [];

    if (typeof uvIndex === 'number' && Number.isFinite(uvIndex) && uvIndex >= 3) {
        advice.push({
            message: 'Passe protetor solar: o índice UV pede proteção.',
            icon: 'sun-hot',
        });
    }
    if (apparentTemperature !== null && apparentTemperature <= 16) {
        advice.push({
            message: `Leve um casaco: sensação térmica de ${formatTemperature(apparentTemperature, temperatureUnit)}${getTemperatureUnitLabel(temperatureUnit)}.`,
            icon: 'thermometer-colder',
        });
    }
    if (
        (typeof rainProbabilityNextSixHours === 'number' && rainProbabilityNextSixHours >= 40)
        || Number.parseFloat(String(rain).trim().replace(',', '.')) >= 0.1
    ) {
        advice.push({
            message: 'Leve guarda-chuva: há previsão de chuva nas próximas horas.',
            icon: 'umbrella-wind',
        });
    }
    if (apparentTemperature !== null && apparentTemperature >= 30) {
        advice.push({
            message: 'Beba água e prefira locais com sombra.',
            icon: 'thermometer-warmer',
        });
    }

    return advice.length > 0
        ? advice
        : [{
            message: `Condições tranquilas para aproveitar ${time === 'day' ? 'o dia' : 'a noite'}.`,
            icon: time === 'day' ? 'day-clear' : 'night-clear',
        }];
};

export const WeatherAdvice = (props: WeatherAdviceProps) => {
    const advice = getWeatherAdvice(props);

    return (
        <div className="weather-advice" aria-label="Dicas para agora">
            <div className="weather-advice-content">
                <p className="weather-advice-label">DICA PARA AGORA</p>
                <ul className="weather-advice-items">
                    {advice.map(({ message, icon }) => (
                        <li className="weather-advice-item" key={message}>
                            <span className="weather-advice-icon" aria-hidden="true">
                                <img src={`/condition/${icon}.svg`} alt="" />
                            </span>
                            <p className="weather-advice-message">{message}</p>
                        </li>
                    ))}
                </ul>
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
import { getImageSource, to24Hours } from '../../utils/utils';
import './Weather.css';

interface WeatherProps {
    code: number;
    temp: number | string;
    time: 'day' | 'night';
    sunrise: string;
    sunset: string;
    description: string;
    humidity: number | string;
    rain: number | string;
    cloudiness: number | string;
}

export const Weather = ({
    code,
    temp,
    time,
    sunrise,
    sunset,
    description,
    humidity,
    rain,
    cloudiness,
}: WeatherProps) => {
    return (
        <div className="weather-container">
            <div className='weather-header'>
                <img className='weather-condition' src={getImageSource(time, code)} alt=''/>
                <div className="temperature-block">
                    <p className="weather-kicker">AGORA</p>
                    <div className="temperature">
                        <span className='weather-temp'>{temp}</span>
                        <span className="temperature-unit">°</span>
                    </div>
                    <p className='weather-description'>{description}</p>
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
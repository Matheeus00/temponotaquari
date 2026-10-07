import './Forecast.css';
import type { ForecastDay } from '../../types';
import {
    formatTemperature,
    getTemperatureUnitLabel,
    type TemperatureUnit,
} from '../../utils/utils';

interface ForecastProps {
    data: ForecastDay[];
    temperatureUnit: TemperatureUnit;
}

export const Forecast = ({ data, temperatureUnit }: ForecastProps) => {
    const upcomingDays = data.slice(1);

    return (
        <div className='forecast-container'>
        {upcomingDays.length > 0 ? (
            upcomingDays.map((day) => {
                return (
                    <div className='forecast-day' key={`${day.date}-${day.weekday}`}>
                        <div className="forecast-day-heading">
                            <h3>{day.weekday}</h3>
                            <span>{day.date}</span>
                        </div>
                        <div className="forecast-temperatures">
                            <div className="forecast-temperature">
                                <img className='max-icon' src='/forecast/pressure-high.svg' alt=''/>
                                <span>{formatTemperature(day.max, temperatureUnit)}<small>{getTemperatureUnitLabel(temperatureUnit)}</small></span>
                            </div>
                            <div className="forecast-temperature forecast-temperature-low">
                                <img className='min-icon' src='/forecast/pressure-low.svg' alt=''/>
                                <span>{formatTemperature(day.min, temperatureUnit)}<small>{getTemperatureUnitLabel(temperatureUnit)}</small></span>
                            </div>
                        </div>
                        <div className='forecast-rain-container'>
                            <img className='forecast-rain-icon' src='/forecast/raindrops.svg' alt=''/>
                            <span>{day.rain_probability}% <small>chance de chuva</small></span>
                        </div>
                    </div>
                )
            })
        ) : (
            <p className='forecast-empty'>Sem previsão disponível para os próximos dias.</p>
        )}
        </div>
    );
};
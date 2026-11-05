import './Forecast.css';
import type { ForecastDay } from '../../types';
import {
    getHolidayForDate,
    getHolidayScopeLabel,
    getHolidayTypeLabel,
} from '../../data/holidays';
import {
    formatTemperature,
    getTemperatureUnitLabel,
    type TemperatureUnit,
} from '../../utils/utils';

interface ForecastProps {
    data: ForecastDay[];
    cityId: string;
    temperatureUnit: TemperatureUnit;
    selectedDate: string | null;
    onSelectDay: (day: { dateKey: string; label: string }) => void;
}

const getLocalDate = (): string =>
    new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo' }).format(new Date());

const getForecastDateKey = (date: string, today: string): string => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

    const dateParts = date.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
    if (!dateParts) return date;

    const [, dayText, monthText, yearText] = dateParts;
    const day = Number(dayText);
    const month = Number(monthText);
    let year = yearText ? Number(yearText) : Number(today.slice(0, 4));
    const candidate = new Date(Date.UTC(year, month - 1, day));
    if (
        candidate.getUTCDate() !== day
        || candidate.getUTCMonth() !== month - 1
        || candidate.getUTCFullYear() !== year
    ) {
        return date;
    }

    let dateKey = `${year}-${monthText.padStart(2, '0')}-${dayText.padStart(2, '0')}`;
    if (!yearText && dateKey < today) {
        year += 1;
        dateKey = `${year}-${monthText.padStart(2, '0')}-${dayText.padStart(2, '0')}`;
    }
    return dateKey;
};

export const Forecast = ({
    data,
    cityId,
    temperatureUnit,
    selectedDate,
    onSelectDay,
}: ForecastProps) => {
    const today = getLocalDate();
    const upcomingDays = data.slice(1);

    return (
        <div className='forecast-container'>
        {upcomingDays.length > 0 ? (
            upcomingDays.map((day) => {
                const dateKey = getForecastDateKey(day.date, today);
                const holiday = getHolidayForDate(dateKey, cityId);
                const holidayScopeLabel = holiday ? getHolidayScopeLabel(holiday.scope) : null;
                const holidayTypeLabel = holiday ? getHolidayTypeLabel(holiday) : null;
                return (
                    <button
                        className={`forecast-day${holiday ? ' forecast-day-holiday' : ''}${selectedDate === dateKey ? ' forecast-day-selected' : ''}`}
                        key={`${day.date}-${day.weekday}`}
                        type="button"
                        aria-label={`Ver previsão por hora para ${day.weekday}, ${day.date}${holiday ? `, ${holidayTypeLabel?.toLowerCase()} ${holidayScopeLabel}: ${holiday.name}` : ''}`}
                        aria-pressed={selectedDate === dateKey}
                        onClick={() => onSelectDay({ dateKey, label: `${day.weekday}, ${day.date}` })}
                    >
                        <div className="forecast-day-heading">
                            <h3>{day.weekday}</h3>
                            <span>{day.date}</span>
                        </div>
                        <span className="forecast-day-holiday-slot" aria-hidden={!holiday}>
                        {holiday ? (
                            <span
                                className={`forecast-day-holiday-label forecast-day-holiday-${holiday.scope === 'Brasil' ? 'national' : holiday.scope === 'Municipal' ? 'municipal' : 'state'}`}
                                title={`${holiday.name} · ${holidayScopeLabel}`}
                            >
                                {holidayTypeLabel} {holidayScopeLabel}
                                <span>{holiday.name}</span>
                            </span>
                        ) : null}
                        </span>
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
                        <span className="forecast-day-hint">
                            {selectedDate === dateKey ? 'Selecionado · ver por hora' : 'Ver previsão por hora'}
                        </span>
                    </button>
                )
            })
        ) : (
            <p className='forecast-empty'>Sem previsão disponível para os próximos dias.</p>
        )}
        </div>
    );
};
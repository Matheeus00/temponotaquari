import { Colors } from '../constants/colors';
import { Condition } from '../constants/conditions';
import { getBeaufortLevel } from '../constants/beaufort';

export type TimeOfDay = 'day' | 'night';
export type WeatherEffect = 'rain' | 'snow' | 'heat';
export type TemperatureUnit = 'C' | 'F' | 'K';
export type WindSpeedUnit = 'km/h' | 'mph' | 'm/s' | 'kn';

const parseWeatherNumber = (value: number | string): number =>
    Number.parseFloat(String(value).trim().replace(',', '.'));

const formatWeatherNumber = (value: number): string =>
    new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value);

export const formatTemperature = (
    value: number | string,
    unit: TemperatureUnit,
): string => {
    const temperature = parseWeatherNumber(value);
    if (!Number.isFinite(temperature)) {
        return String(value);
    }

    const convertedTemperature = {
        C: temperature,
        F: Math.round((temperature * 9) / 5 + 32),
        K: temperature + 273.15,
    }[unit];

    return formatWeatherNumber(convertedTemperature);
}

export const getTemperatureUnitLabel = (unit: TemperatureUnit): string =>
    unit === 'K' ? 'K' : `°${unit}`;

export const formatWindSpeed = (
    value: number | string,
    unit: WindSpeedUnit,
): string => {
    const speedInKmh = parseWeatherNumber(value);
    if (!Number.isFinite(speedInKmh)) {
        return String(value);
    }

    const convertedSpeed = {
        'km/h': speedInKmh,
        mph: speedInKmh / 1.609344,
        'm/s': speedInKmh / 3.6,
        kn: speedInKmh / 1.852,
    }[unit];

    return `${formatWeatherNumber(convertedSpeed)} ${unit === 'kn' ? 'nós' : unit}`;
}

const timeSpecificIcons = new Set([
    'clear',
    'dust',
    'fog',
    'haze',
    'overcast',
    'partly-cloudy',
    'partly-cloudy-drizzle',
    'partly-cloudy-fog',
    'partly-cloudy-hail',
    'partly-cloudy-haze',
    'partly-cloudy-rain',
    'partly-cloudy-sleet',
    'partly-cloudy-smoke',
    'partly-cloudy-snow',
    'thunderstorms',
    'thunderstorms-rain',
    'thunderstorms-snow',
]);

const genericIcons = new Set([
    'cloudy',
    'drizzle',
    'dust',
    'dust-wind',
    'fog',
    'hail',
    'haze',
    'hurricane',
    'not-available',
    'rain',
    'sleet',
    'smoke',
    'snow',
    'thunderstorms',
    'thermometer-colder',
    'umbrella-wind',
    'umbrella-wind-alt',
]);

export const getCurrentTimeColor = (): string => {
    return Colors[dayHour()];
}

export const isDarkColor = (color: string): boolean => {
    const channels = color.match(/[a-f\d]{2}/gi);
    if (!channels || channels.length < 3) {
        return false;
    }

    const [red, green, blue] = channels.slice(0, 3).map((channel) => {
        const value = Number.parseInt(channel, 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue < 0.35;
}

export const dayHour = (): number => {
    return new Date().getHours();
}

export const getImageSource = (time: TimeOfDay, code: number): string => {
    const icon = Condition[code]?.icon ?? Condition[47].icon;

    if (timeSpecificIcons.has(icon)) {
        return `/condition/${time}-${icon}.svg`;
    }

    return `/condition/${genericIcons.has(icon) ? icon : 'not-available'}.svg`;
}

export const getWeatherEffect = (
    code: number,
    temperature: number | string,
): WeatherEffect | null => {
    const icon = Condition[code]?.icon ?? '';
    const label = Condition[code]?.label.toLocaleLowerCase('pt-BR') ?? '';

    if (icon.includes('snow') || icon.includes('sleet') || label.includes('neve')) {
        return 'snow';
    }

    if (
        icon.includes('rain')
        || icon.includes('drizzle')
        || icon.includes('thunderstorms')
        || icon.includes('hail')
        || icon === 'hurricane'
        || label.includes('chuva')
        || label.includes('tempestade')
    ) {
        return 'rain';
    }

    const temperatureValue = Number.parseFloat(String(temperature).replace(',', '.'));
    if (
        temperatureValue >= 33
        || icon === 'thermometer-warmer'
        || label.includes('quente')
        || label.includes('calor')
    ) {
        return 'heat';
    }

    return null;
}

export const getRainDropCount = (code: number, rainfall: number | string): number => {
    const label = Condition[code]?.label.toLocaleLowerCase('pt-BR') ?? '';
    const rainfallAmount = Number.parseFloat(String(rainfall).replace(',', '.'));

    return label.includes('forte')
        || label.includes('severa')
        || label.includes('pesada')
        || rainfallAmount >= 5
        ? 24
        : 14;
}

export const to24Hours = (value: string): string => {
    const [time, modifier] = value.split(' ');
    const [rawHour, minute] = time.split(':');
    const hour = Number.parseInt(rawHour, 10);

    if (modifier === 'am') {
        return `${hour === 12 ? 0 : hour}:${minute}`;
    }

    if (modifier === 'pm') {
        return `${hour === 12 ? hour : hour + 12}:${minute}`;
    }

    return value;
}

export const getBeaufortIndex = (value: string): number => {
    const speed = parseWeatherNumber(value);
    return Number.isFinite(speed) ? getBeaufortLevel(speed).force : 0;
}

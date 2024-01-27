import { Colors } from "../Colors";
import { Condition } from "../Condition";

export const getCurrentTimeColor = () => {
    return Colors[dayHour()];
}
    
export const dayHour = () => {
    return new Date().getHours();
}

export const getImageSource = (time, code) => {
    const icon = Condition[code].icon;
    
    try {
        return require(`../../public/condition/${time}-${icon}.svg`);
    } catch (error) {
        return require(`../../public/condition/${icon}.svg`);
    }
}

export const to24Hours = (value) => {
    const [time, modifier] = value.split(' ');

    if (modifier === 'am') {
        return time;
    }
    
    else if (modifier === 'pm') {
        const [hour, minute] = time.split(':');

        const newHour = parseInt(hour) + 12;

        return newHour + ":" + minute;
    }
}

export const getBeaufortIndex = (value) => {
    const speed = parseFloat(value.split(" ")[0]); 

    let index = 0;

    if ( speed >= 2 && speed < 6 ) {
        index = 1;
    } else if ( speed >= 7 && speed < 12 ) {
        index = 2;
    } else if ( speed >= 13 && speed < 18 ) {
        index = 3;
    } else if ( speed >= 19 && speed < 29 ) {
        index = 4;
    } else if ( speed >= 30 && speed < 38 ) {
        index = 5;
    } else if ( speed >= 39 && speed < 49 ) {
        index = 6;
    } else if ( speed >= 50 && speed < 61 ) {
        index = 7;
    } else if ( speed >= 62 && speed < 74 ) {
        index = 8;
    } else if ( speed >= 75 && speed < 88 ) {
        index = 9;
    } else if ( speed >= 89 && speed < 102 ) {
        index = 10;
    } else if ( speed >= 103 && speed < 117 ) {
        index = 11;
    } else if ( speed >= 118 ) {
        index = 12;
    }

    return index;
}
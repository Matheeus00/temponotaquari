import { getImageSource, to24Hours } from '../Util';
import './Weather.css';

export const Weather = ({code, temp, time, sunrise, sunset, description}) => {
    return (
        <div className="weather-container">
            <div className='weather-header'>
                <img className='weather-condition' src={getImageSource(time, code)} alt='Condition Code'/>
                <div>
                    <span className='weather-temp'>{temp}</span>
                    <img src={`./common/celsius.svg`} alt='Celsius'/>
                </div>
            </div>
            <p className='weather-description'>
                {description}
            </p>
            <hr />
            <div className='weather-body'>
                <div className='sunrise' title='Nascer do Sol'>
                    <img className='sunrise-icon' src={`./condition/sunrise.svg`} alt='Sunrise'/>
                    <p style={{marginTop: 0}}>{to24Hours(sunrise)}</p>
                </div>
                <div className='sunset' title='Pôr do Sol'>
                    <img className='sunset-icon' src={`./condition/sunset.svg`} alt='Sunset'/>
                    <p style={{marginTop: 0}}>{to24Hours(sunset)}</p>
                </div>
            </div>
        </div>
    );
};
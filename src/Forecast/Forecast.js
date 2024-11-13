import './Forecast.css';

export const Forecast = ({data}) => {
    return (
        <div className='forecast-container'>
        {
            data.map(day => {
                return (
                    <div className='forecast-day'>
                        <h3>{day.date} - {day.weekday}</h3>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img className='max-icon' src={`./forecast/pressure-high.svg`} alt='Max-Temperatura'/>
                            <p>{day.max}ºC - {day.min}ºC</p>
                            <img className='min-icon' src={`./forecast/pressure-low.svg`} alt='Min-Temperatura'/>
                        </div>
                        <hr />
                        <div>
                            <p>Probabilidade de Chuva</p>
                            <div className='forecast-rain-container'>
                                <img className='forecast-rain-icon' src={`./forecast/raindrops.svg`} alt='Probabilidade de Chuva'/>
                                <p>{day.rain_probability}%</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }
        </div>
    );
};
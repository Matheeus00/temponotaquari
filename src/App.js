import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import api from './data.json';
import { Forecast } from './Forecast/Forecast';
import Moon from './Moon';
import Rose from './Rose';
import { dayHour, getCurrentTimeColor } from './Util';
import Weather from './Weather';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${api.url}?format=${api.format}&key=${api.key}&city_name=${api.location}`, {
      headers: {
      }
    })
    .then((response) => setData(response.data))
  }, []);

  const json = data.results;

  if (json) {
    const hour = dayHour();
    // DO BETTER - GET SUNRISE AND SUNSET
    const time = hour >= 6 && dayHour() <= 18 ? "day" : "night";

    return (
      <div className="App" style={{backgroundColor: getCurrentTimeColor()}}>
        <div className='current-data'>
          <Weather 
            code={json.condition_code}
            temp={json.temp}
            time={time}
            sunrise={json.sunrise}
            sunset={json.sunset}
            description={json.description}
            humidty={json.humidity}
            rain={json.rain}
            cloudiness={json.cloudiness}
          />
          <Rose
            rotation={json.wind_direction}
            speed={json.wind_speedy}
          />
          <Moon
            moon={json.moon_phase}
          />
        </div>
        <div>
          <Forecast 
            data={json.forecast}
          />
        </div>
      </div>
    );
  }
}

export default App;
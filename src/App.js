import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';
import Moon from './Moon';
import Rose from './Rose';
import { dayHour, getCurrentTimeColor } from './Util';
import Weather from './Weather';
import api from './data.json';

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
        <div style={{display: 'flex', justifyContent: 'space-evenly', height: '100%', alignItems: 'center', flexWrap: 'wrap'}}>
          <Weather 
            code={json.condition_code}
            temp={json.temp}
            time={time}
            sunrise={json.sunrise}
            sunset={json.sunset}
            description={json.description}
          />
          <Moon
            moon={json.moon_phase}
          />
          <Rose
            rotation={json.wind_direction}
            speed={json.wind_speedy}
          />
        </div>
      </div>
    );
  }
}

export default App;
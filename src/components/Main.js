import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const fetchWeatherData = async ({ queryKey }) => {
  const location = queryKey[1];
  const currentWeatherResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
  );
  const forecastResponse = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
  );

  return {
    current: currentWeatherResponse.data,
    forecast: forecastResponse.data,
  };
};

function Main() {
  const [location, setLocation] = useState('London');
  const { data, error, isLoading } = useQuery({
    queryKey: ['weatherData', location],
    queryFn: fetchWeatherData
  });

  if (isLoading) return <div className='loading-text'>Loading...</div>;
  if (error) return <div className='error-fetching-text'>Error fetching data. Location not found</div>;

  const { current, forecast } = data;

  const handleChangeLocation = () => {
    const newLocation = prompt('Enter new location:');
    if (newLocation) {
      setLocation(newLocation);
    }
  };

  return (
    <>

    <div className="container">
      <div className="weather-side">
        <div className="weather-gradient"></div>
        <div className="date-container">
          <h2 className="date-dayname">{new Date(current.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</h2>
          <span className="date-day">
            {new Date(current.dt * 1000).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <i className="location-icon" data-feather="map-pin"></i>
          <span className="location">{current.name}, {current.sys.country}</span>
        </div>
        <div className="weather-container">
          <i className="weather-icon" data-feather="sun"></i>
          <h1 className="weather-temp">{Math.round(current.main.temp)}°C</h1>
          <h3 className="weather-desc">{current.weather[0].description}</h3>
        </div>
      </div>
      <div className="info-side">
        <div className="today-info-container">
          <div className="today-info">
            <div className="precipitation">
              <span className="title">PRECIPITATION</span>
              <span className="value">{current.rain ? current.rain['1h'] : 0} %</span>
              <div className="clear"></div>
            </div>
            <div className="humidity">
              <span className="title">HUMIDITY</span>
              <span className="value">{current.main.humidity} %</span>
              <div className="clear"></div>
            </div>
            <div className="wind">
              <span className="title">WIND</span>
              <span className="value">{current.wind.speed} m/s</span>
              <div className="clear"></div>
            </div>
          </div>
        </div>
        <div className="week-container">
          <ul className="week-list">
            {forecast.list
              .filter(forecastItem => {
                const forecastDate = new Date(forecastItem.dt_txt).setHours(0, 0, 0, 0);
                const currentDate = new Date().setHours(0, 0, 0, 0);
                return forecastDate > currentDate;
              })
              .filter((forecastItem, index, self) =>
                index === self.findIndex(item => 
                  new Date(item.dt_txt).toLocaleDateString('en-GB') === new Date(forecastItem.dt_txt).toLocaleDateString('en-GB')
                )
              )
              .slice(0, 4)
              .map((forecastItem, index) => (
                <li key={index} className={index === 0 ? "active" : ""}>
                  <span className="day-name">
                    {new Date(forecastItem.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="day-temp">{Math.round(forecastItem.main.temp)}°C</span>
                </li>
              ))
            }
            <div className="clear"></div>
          </ul>
        </div>


        <div className="location-container">
          <button className="location-button" onClick={handleChangeLocation}>
            <i data-feather="map-pin"></i>
            <span>Change location</span>
          </button>
        </div>
      </div>
    </div>

    </>
  );
}

export default Main;

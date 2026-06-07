import { useState, useEffect } from 'react'
import axios from 'axios'

const apiOpenWeather = process.env.REACT_APP_OPENWEATHER_API

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState(null)
  
  const restcountriesURL = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  

  useEffect(() => {
    console.log('effect run, countries is now', countries)

    if (!countries) {

      setFilteredCountries([])
      setWeather(null)
      return 
    }

      console.log('fetching countries selected...')

      axios
      .get(restcountriesURL)
      .then(response => {
        const allCountries = response.data

        const result = allCountries.filter(country => {
          return country.name.common
            .toLowerCase()
            .includes(countries.toLowerCase())
        })
        setFilteredCountries(result)
      })
    

  }, [countries])


  useEffect(() => {
  
    if (filteredCountries.length !== 1) {
      setWeather(null)
      return
    }

    const country = filteredCountries[0]
    
    if (!country.capitalInfo?.latlng) {
      setWeather(null)
      return
    }

    const [lat, lon] = filteredCountries[0].capitalInfo.latlng
    
    axios
    .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiOpenWeather}&units=metric`)
    .then(response => {
      console.log('dados  analisar:', response.data)
      setWeather(response.data)
    })

    .catch(error => {
      console.log('erro: ', error)
    })

  }, [filteredCountries])


  const handleChange = (event) => {
    event.preventDefault()
    const value = event.target.value
    
    setSearchTerm(value)
    setCountries(value)
  }  

 
  return (
    <div>
        find countries: <input value={searchTerm} onChange={handleChange}/>

        {filteredCountries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
          filteredCountries.map(country => (
            <div key={country.name.common}>
              <p>
                {country.name.common}
              </p>
              
              <button onClick={() => setFilteredCountries([country])}>show</button>
            </div>
            
          ))
          
        )}
        
        {filteredCountries.length === 1 && (
            <div>
              <h2>{filteredCountries[0].name.common}</h2>
              <p>Capital: {filteredCountries[0].capital}</p>
              <p>Área: {filteredCountries[0].area}</p>
              <h3>Languages</h3>
              <ul>
                {filteredCountries[0].languages &&
                  Object.values(filteredCountries[0].languages).map(language => (
                    <li key={language}>
                      {language}
                    </li>
                ))}
              </ul>
              <img
                src={filteredCountries[0]?.flags?.png}
                alt={`Flag of ${filteredCountries[0]?.name?.common}`}
              />
              {weather && weather.weather && (
              <div>
                <h3>Weather in {filteredCountries[0].capital}</h3>

                <p>Temperature {weather.main.temp}</p>
    
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                />
                <p>Wind {weather.wind.speed} m/s</p>
              </div>
                )}
            </div>
          )}
    </div>
  )
} 

export default App
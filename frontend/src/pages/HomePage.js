import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import './styles/HomePage.scss';
import './styles/leaflet.scss';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useMap } from 'react-leaflet';

import FindNearPlaceWithFilters from "../components/PlaceComponents/FindNearPlace/FindNearPlaceComponent";
import News from "../components/News/News";
import FindNearPlaceTouristicAttra from "../components/PlaceComponents/FindNearPlaceTouristicAttra/FindNearPlaceTouristicAttra";
import FindNearPlaceTransport from "../components/PlaceComponents/FindNearPlaceTransport/FindNearPlaceTransport";

Chart.register(...registerables);
Chart.register(LineController, LineElement, PointElement, LinearScale, Title);

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);

  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);

  const [selectedLatitude, setSelectedLatitude] = useState('');
  const [selectedLongitude, setSelectedLongitude] = useState('');
  const [forecast, setForecast] = useState([]);
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [emergencyNumbers, setEmergencyNumbers] = useState(null);

  const [showCityinfo, setShowCityinfo] = useState(false);

  const [selectedIso2, setSelectedIso2] = useState('');

  const mapRef = useRef(null);

  const [coordinatesEntered, setCoordinatesEntered] = useState(false); // Si les coordonnées sont entrées, afficher la map

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5001/user-info', {
          headers: { 'Authorization': token },
        });
        if (response.data) {
          setUserName(response.data.name);
        }
      } catch (err) {
        console.error(err);
      }
    };
    const rollBackOneYear = (dateString) => {
      // Convertir la chaîne de date en objet Date
      let date = new Date(dateString);

      // Retirer une année
      date.setFullYear(date.getFullYear() - 1);

      // Convertir l'objet Date en chaîne de date au format 'YYYY-MM-DD'
      let updatedDate = date.toISOString().split('T')[0];
      return updatedDate;
    }

    const parseCSV = (csvData) => { // Pour utiliser le csv plutot que l'Api
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');

      const cities = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length === headers.length) {
          const city = {
            city: currentLine[0] ? currentLine[0].replace(/"/g, '') : '',
            city_ascii: currentLine[1] ? currentLine[1].replace(/"/g, '') : '',
            lat: currentLine[2] ? currentLine[2].replace(/"/g, '') : '',
            lng: currentLine[3] ? currentLine[3].replace(/"/g, '') : '',
            country: currentLine[4] ? currentLine[4].replace(/"/g, '') : '',
            iso2: currentLine[5] ? currentLine[5].replace(/"/g, '') : '',
            iso3: currentLine[6] ? currentLine[6].replace(/"/g, '') : '',
            admin_name: currentLine[7] ? currentLine[7].replace(/"/g, '') : '',
            capital: currentLine[8] ? currentLine[8].replace(/"/g, '') : '',
            population: currentLine[9] ? parseInt(currentLine[9].replace(/"/g, '')) : 0,
            id: currentLine[10] ? parseInt(currentLine[10].replace(/"/g, '')) : 0,
          };

          cities.push(city);
        }
      }

      return cities;
    };

    const getCities = async () => { // Ramasser les villes dans le csv
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/worldcities.csv');
        const csvData = await response.text();
        const cities = parseCSV(csvData);
        setCities(cities);
      } catch (err) {
        console.error(err);
      }
    };

    const parseEmergencyCSV = (csvData) => {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',');
      const emergencyData = [];

      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length === headers.length) {
          const emergency = {
            country: currentLine[0] ? currentLine[0].replace(/"/g, '') : '',
            police: currentLine[1] ? currentLine[1].replace(/"/g, '') : '',
            ambulance: currentLine[2] ? currentLine[2].replace(/"/g, '') : '',
            fire: currentLine[3] ? currentLine[3].replace(/"/g, '') : '',
          };

          emergencyData.push(emergency);
        }
      }

      return emergencyData;
    };

    const getEmergencyNumbers = async () => {
      try {
        const response = await fetch(process.env.PUBLIC_URL + '/911-by-country-2023.csv');
        const csvData = await response.text();
        const emergencyNumbers = parseEmergencyCSV(csvData);
        setEmergencyNumbers(emergencyNumbers);
      } catch (err) {
        console.error(err);
      }
    };

    const getCurrencyData = async () => { // Taux de Change
      try {
        const response = await axios.get('https://happyapi.fr/api/devises');
        if (response.data && response.data.result && response.data.result.result && response.data.result.result.devises) {
          setCurrencies(response.data.result.result.devises);
        }
      } catch (err) {
        console.error(err);
      }
    };
    let newlat;
    let newlong;
    const updateMapCenter = () => {
      if (selectedLatitude !== '' || selectedLongitude !== '') {
        if (selectedLatitude !== newlat || newlong !== selectedLongitude) {
          renderMap(selectedLatitude, selectedLongitude)// 10 est le niveau de zoom que vous avez choisi.
          newlat = selectedLatitude;
          newlong = selectedLongitude;
        }
      }
    };
    if (selectedLatitude && selectedLongitude) { // Coordonées se mettent a jour automatiquement apres la ville entrée
      let newStartDate = rollBackOneYear(startDate);
      let newEndDate = rollBackOneYear(endDate);
      const fetchWeather = async () => {
        try {
          // const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${selectedLatitude}&longitude=${selectedLongitude}&hourly=temperature_2m`);
          const response = await axios.get(`https://archive-api.open-meteo.com/v1/era5?latitude=${selectedLatitude}&longitude=${selectedLongitude}&start_date=${newStartDate}&end_date=${newEndDate}&hourly=temperature_2m`)
          // const response = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m&start_date=2023-10-17&end_date=2023-11-01')
          if (response.data && response.data.hourly) {
            setForecast(response.data.hourly);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchWeather();
    }

    getCurrencyData();
    fetchUserInfo();
    getCities();
    getEmergencyNumbers();
    updateMapCenter();
  }, [selectedLatitude, selectedLongitude, startDate, endDate]);
  const renderMap = (lat, long) => (
    <div className="map-container">
      <MapContainer
        center={[lat, long]}
        zoom={10}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="Map data © OpenStreetMap contributors"
        />
        <Marker position={[lat, long]} />
        <FlyTo lat={lat} long={long} zoom={10} />
      </MapContainer>
    </div>
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value.length > 0) {
      const citySuggestions = cities
        .filter((city) => city.city.toLowerCase().startsWith(value.toLowerCase()))
        .sort((a, b) => b.population - a.population);

      const countrySuggestions = cities.filter((city) => city.country.toLowerCase().startsWith(value.toLowerCase()));
      setSuggestions([...citySuggestions, ...countrySuggestions]);
    } else {
      setSuggestions([]);
    }
  };


  const handleSuggestionClick = (city) => {
    setInputValue(city.city + ', ' + city.country);
    // setInputValue(city.city);
    setSelectedCity(city);
    setSuggestions([]);
  };

  const handleValidation = () => {
    if (selectedCity && startDate && endDate) {
      setShowCityinfo(true);
      console.log("Toutes les données sont renseignées !");
      // Mettre à jour les coordonnées de la ville sélectionnée
      setSelectedLatitude(selectedCity.lat);
      setSelectedLongitude(selectedCity.lng);
      setSelectedIso2(selectedCity.iso2);
      localStorage.setItem('selectedCity', selectedCity.city);
      localStorage.setItem('selectedCountry', selectedCity.country);
      setCoordinatesEntered(true); // Afficher la carte
    } else {
      console.log("Toutes les données ne sont pas renseignées.");
    }
  };

  const FlyTo = ({ lat, long, zoom = 10 }) => {
    const map = useMap();
    map.flyTo([lat, long], zoom);
    return null;
  }

  let currentEmergencyNumbers;
  if (selectedCity) {
    currentEmergencyNumbers = emergencyNumbers?.find(e => e.country === selectedCity.country)
  } else {
    currentEmergencyNumbers = ""
  }
  return (
    <div className='accueil'>
      <div className="container">
        <div className="navbar">
          <div className="firstbarre">
            <div className="logo"></div>
            <div className="profile-button" onClick={() => navigate('/profil')}>
              <FaUserCircle size={30} />
            </div>
            <div onClick={() => navigate('/list')}>
              TodoList
            </div>
          </div>
          <div className="user-info">
            <div className="secondbarre">
              {userName && <div className="bonjour">BIENVENUE SUR VOYAGERZ, {userName}</div>}
              <div className="afterBonjour">

                <div className="destination">
                  <p className="destinationtitle">Destination :</p><br />
                  <div className="inputandsuggestion">
                    <input className="distinationinput" type="text" value={inputValue} onChange={handleChange} placeholder="Ville, Pays" /> <br />
                    {suggestions.length > 0 && (
                      <ul className="suggestions">
                        {suggestions.map((suggestion, index) => (
                          <div className="divaroundli">
                            <div className="divimgposition">
                              <img src="/assets/icon-position.png" alt="Géorepérage" />

                            </div>
                            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                              {suggestion.city}, {suggestion.country}
                            </li>
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <label className="date1">
                  <p className="date1title">Je pars le :</p>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </label>
                <label className="date2">
                  <p className="date2title">Je reviens le :</p>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </label>
                <div className="currencydiv">
                  <p>Devise :</p>
                  <select
                    className="currencyselect"
                    onChange={(e) => {
                      const currencyCode = e.target.value;
                      const selectedCurrency = currencies.find(
                        (currency) => currency.codeISODevise === currencyCode
                      );
                      setSelectedCurrency(selectedCurrency);
                    }}
                  >
                    {currencies.map((currency) => (
                      <option key={currency.codeISODevise} value={currency.codeISODevise}>
                        {currency.codeISODevise}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCity && startDate && endDate && (
                  <button class="barre-validatebutton" onClick={handleValidation}>Valider</button>
                )}
              </div>
            </div>
          </div>
        </div>
        {coordinatesEntered && renderMap(selectedLatitude, selectedLongitude)}
        {showCityinfo && (
          <div className="selected-city">
            <h2>{selectedCity.city}, {selectedCity.country}</h2>
            <p>Population : {selectedCity.population} en 2023 </p>
            <p></p>
            <p>Recommandation Sanitaire : </p>
            {selectedCurrency && (<p>Taux de Change : 1 euro = {selectedCurrency.taux} {selectedCurrency.codeISODevise}</p>)}
            <p>Météo : </p>
            {(forecast.time && forecast.temperature_2m) ? (
              <Line
                data={{
                  labels: forecast.time.map(time => new Date(time).toLocaleDateString()),
                  datasets: [{
                    label: 'Température',
                    data: forecast.temperature_2m,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                  }],
                }}
                options={{
                  scales: {
                    x: {
                      ticks: {
                        callback: function (val, index) {
                          return index % 3 === 0 ? this.getLabelForValue(val) : '';
                        }
                      }
                    },
                    y: {
                      beginAtZero: true
                    },
                  },
                  pointRadius: 1,
                }}
              />
            ) : <p>Données météo non disponibles</p>}
            <p>Transport : </p>
            <FindNearPlaceTransport lat={selectedLatitude} lng={selectedLongitude} />
            <p>Activité local : </p>
            <p class="secours">Num de Sécours :
              <li>Ambulance: {currentEmergencyNumbers?.ambulance}</li>
              <li>Police: {currentEmergencyNumbers?.police}</li>
              <li>Pompier: {currentEmergencyNumbers?.fire}</li>
            </p>
            <p>Spécialités : </p>
            <p>Actualités : </p>
            <News iso2={selectedIso2} />
            <p>Fun Facts : </p>
            <p>Lieux Touristiques : </p>
            <FindNearPlaceTouristicAttra lat={selectedLatitude} lng={selectedLongitude} />
            <br />
            <FindNearPlaceWithFilters lat={selectedLatitude} lng={selectedLongitude} />
            <p></p>
          </div>
        )}
      </div >
    </div >
  );
};

export default HomePage;

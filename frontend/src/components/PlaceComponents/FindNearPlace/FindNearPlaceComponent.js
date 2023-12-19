/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Rating } from '@mui/material';
import './styles/style.scss'

export default function FindNearPlaceWithFilters(props) {
    const [selectedOption, setSelectedOption] = useState('');
    const [places, setPlaces] = useState([]);

    const options = [
        { value: 'bar', label: 'Bar' },
        { value: 'restaurant', label: 'Restaurant' },
        { value: 'airport', label: 'Airport' },
        { value: 'amusement_park', label: 'Parc d\'attractions' },
        { value: 'aquarium', label: 'Aquarium' },
        { value: 'art_gallery', label: 'Galerie d\'art' },
        { value: 'bakery', label: 'Boulangerie' },
        { value: 'bank', label: 'Banque' },
        { value: 'book_store', label: 'Librairie' },
        { value: 'bowling_alley', label: 'Bowling' },
        { value: 'bus_station', label: 'Station de bus' },
        { value: 'doctor', label: 'Médecin' },
        { value: 'drugstore', label: 'Pharmacie' },
        { value: 'gas_station', label: 'Station-service' },
        { value: 'hospital', label: 'Hôpital' },
        { value: 'library', label: 'Bibliothèque' },
        { value: 'movie_theater', label: 'Cinéma' },
        { value: 'museum', label: 'Musée' },
        { value: 'night_club', label: 'Boîte de nuit' },
        { value: 'park', label: 'Parc' },
        { value: 'parking', label: 'Parking' },
        { value: 'pharmacy', label: 'Pharmacie' },
        { value: 'shopping_mall', label: 'Centre commercial' },
        { value: 'supermarket', label: 'Supermarché' },
        { value: 'train_station', label: 'Gare' }
    ]

    let lat = props.lat;
    let lng = props.lng;

    const handleSelectChange = (value) => {
        setSelectedOption(value);
    }
      
    const getPlaces = async (value) => {
        if (value !== '') {        
            const options = {
                method: 'GET',
                url: 'https://map-places.p.rapidapi.com/nearbysearch/json',
                params: {
                  location: `${lat},${lng}`,
                  radius: '5000',
                  type: selectedOption
                },
                headers: {
                  'X-RapidAPI-Key': '08a5544057msh6fa00dd9aa62de2p16d3dfjsn0167428a7366',
                  'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
                }
            };
        

            try {
                const response = await axios.request(options);
                const places = response.data.results    
                setPlaces(places);
            } catch (err) {
                console.error(err.message);
            }
        }
    }

    useEffect(() => {
        if (selectedOption !== '') {
            getPlaces(selectedOption);
        }
    }, [selectedOption]);

    return (
        <div>
            <div className="slider-container">
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={`card ${selectedOption === option.value ? 'active' : ''}`}
                        onClick={() => handleSelectChange(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>

            {places.length > 0 && (
                <div className="slider-container">
                    {places.map((place, index) => (
                        <div key={index} className="slider-item">
                            <p className="name">{place.name}</p>
                            <p className="vicinity">{place.vicinity}</p>
                            <div className="side-b-side">
                                <Rating 
                                    name="half-rating-read"
                                    value={place.rating}
                                    onChange={(place, newPlace) => {
                                        setPlaces(newPlace);
                                    }} 
                                    precision={0.1} 
                                    readOnly 
                                />
                                <p className="rating-total">{place.user_ratings_total} vote</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
import React, { useState } from "react";
import axios from "axios";
import { Rating } from "@mui/material";

import "./styles/style.scss"

export default function FindNearPlaceTouristicAttra(props) {
    const [places, setPlaces] = useState([]);

    let lat = props.lat;
    let lng = props.lng;

    const getTouristAttraction = async () => {
        const options = {
            method: 'GET',
            url: 'https://map-places.p.rapidapi.com/nearbysearch/json',
            params: {
              location: `${lat},${lng}`,
              radius: '5000',
              type: 'tourist_attraction'
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

    return (
        <div>
            {places.length === 0 && (
                <div className="attraction-button-container">
                    <button className="get-attraction-button" onClick={getTouristAttraction}>Voir les attractions</button>
                </div>
            )}
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
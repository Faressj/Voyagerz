import React, { useState } from "react";
import axios from "axios";
import { Rating } from '@mui/material';

import "./styles/style.scss"

export default function Transport(props) {
    const [bus, setBus] = useState([]);
    const [showBusMessage, setShowBusMessage] = useState(false);
    const [lightRail, setLightRail] = useState([]);
    const [showLightRailMessage, setShowLightRailMessage] = useState(false);
    const [taxis, setTaxis] = useState([]);
    const [showTaxisMessage, setShowTaxisMessage] = useState(false);

    let lat = props.lat;
    let lng = props.lng;

    const getBus = async () => {
        const options = {
            method: 'GET',
            url: 'https://map-places.p.rapidapi.com/nearbysearch/json',
            params: {
              location: `${lat},${lng}`,
              radius: '5000',
              type: 'bus_station'
            },
            headers: {
              'X-RapidAPI-Key': '08a5544057msh6fa00dd9aa62de2p16d3dfjsn0167428a7366',
              'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
            }
        };
    

        try {
            const response = await axios.request(options);
            const bus = response.data.results    
            setBus(bus);
            setShowBusMessage(bus.length === 0);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getLightRail = async () => {
        const options = {
            method: 'GET',
            url: 'https://map-places.p.rapidapi.com/nearbysearch/json',
            params: {
              location: `${lat},${lng}`,
              radius: '5000',
              type: 'light_rail_station'
            },
            headers: {
              'X-RapidAPI-Key': '08a5544057msh6fa00dd9aa62de2p16d3dfjsn0167428a7366',
              'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
            }
        };
    

        try {
            const response = await axios.request(options);
            const lightRail = response.data.results    
            setLightRail(lightRail);
            setShowLightRailMessage(lightRail.length === 0);
        } catch (err) {
            console.error(err.message);
        }
    }

    const getTaxis = async () => {
        const options = {
            method: 'GET',
            url: 'https://map-places.p.rapidapi.com/nearbysearch/json',
            params: {
              location: `${lat},${lng}`,
              radius: '5000',
              type: 'taxi_stand'
            },
            headers: {
              'X-RapidAPI-Key': '08a5544057msh6fa00dd9aa62de2p16d3dfjsn0167428a7366',
              'X-RapidAPI-Host': 'map-places.p.rapidapi.com'
            }
        };
    

        try {
            const response = await axios.request(options);
            const taxis = response.data.results    
            setTaxis(taxis);
            setShowTaxisMessage(taxis.length === 0);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div>
            <div className="transport-button-container">
                <div className="message-container">
                    {bus.length === 0 && !showBusMessage && (
                        <button className="get-transport-button" onClick={getBus}>Voir les bus</button>
                    )}
                    {showBusMessage && <p className="no-transport-message">Aucun Bus n'a été trouvé</p>}
                </div><br></br>

                <div className="message-container">
                    {lightRail.length === 0 && !showLightRailMessage && (
                        <button className="get-transport-button" onClick={getLightRail}>Voir les trams</button>
                    )}
                    {showLightRailMessage && <p className="no-transport-message">Aucun Tram n'a été trouvé</p>}
                </div><br></br>

                <div className="message-container">
                    {taxis.length === 0 && !showTaxisMessage && (
                        <button className="get-transport-button" onClick={getTaxis}>Voir les taxis</button>
                    )}
                    {showTaxisMessage && <p className="no-transport-message">Aucun Taxi n'a été trouvé</p>}
                </div>
            </div>

            {bus.length > 0 && (
                <div>
                    <p>Bus</p>
                    <div className="slider-container">
                        {bus.map((bus, index) => (
                            <div key={index} className="slider-item">
                                <p>{bus.name}</p>
                                <p>{bus.vicinity}</p>
                                <div className="side-b-side">
                                    <Rating 
                                        name="half-rating-read" 
                                        value={bus.rating}
                                        onChange={(bus, newBus) => {
                                            setBus(newBus);
                                        }}
                                        precision={0.5} 
                                        readOnly 
                                    />
                                    <p className="rating-total">{bus.user_ratings_total} vote</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {lightRail.length > 0 && (
                <div>
                    <p>Tram</p>
                    <div className="slider-container">
                        {lightRail.map((lightRail, index) => (
                            <div key={index} className="slider-item">
                                <p>{lightRail.name}</p>
                                <p>{lightRail.vicinity}</p>
                                <div className="side-b-side">
                                    <Rating
                                        name="half-rating-read"
                                        value={lightRail.rating}
                                        onChange={(lightRail, newLightRail) => {
                                            setLightRail(newLightRail);
                                        }}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <p className="rating-total">{lightRail.user_ratings_total} vote</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {taxis.length > 0 && (
                <div>
                    <p>Taxis</p>
                    <div className="slider-container">
                        {taxis.map((taxi, index) => (
                            <div key={index} className="slider-item">
                                <p>{taxi.name}</p>
                                <p>{taxi.vicinity}</p>
                                <div className="side-b-side">
                                    <Rating
                                        name="half-rating-read"
                                        value={taxi.rating}
                                        onChange={(taxi, newTaxi) => {
                                            setTaxis(newTaxi);
                                        }}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <p className="rating-total">{taxi.user_ratings_total} vote</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
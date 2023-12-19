import React, { useState } from "react";
import axios from "axios";
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import './styles/style.scss'

export default function EmergencyNumbers(props) {
    const [emergencyNumbers, setEmergencyNumbers] = useState([]);
    const [police, setPolice] = useState([]);
    const [ambulance, setAmbulance] = useState([]);
    const [fire, setFire] = useState([]);
    const [dispatch, setDispatch] = useState([]);

    let iso2 = props.iso2;

    const getEmergencyNumbers = async () => {
        try {
            const response = await axios.get(`https://emergencynumberapi.com/api/country/${iso2}`);
            const emergencyNumbers = response.data;
            setEmergencyNumbers(emergencyNumbers);
            const police = emergencyNumbers.data.police.all;

            setPolice(police);
            const ambulance = emergencyNumbers.data.ambulance.all;
            setAmbulance(ambulance);

            const fire = emergencyNumbers.data.fire.all;
            setFire(fire);

            const dispatch = emergencyNumbers.data.dispatch.all;
            setDispatch(dispatch);

            if (response.status === 404) {
                console.log('No emergency numbers');
            }

        } catch (err) {
            console.error(err.message);
        }
    }

    const handleButtonClick = () => {
        if (iso2 !== '') {
            getEmergencyNumbers();
        }
    }
    
    return (
        <div>
            <button onClick={handleButtonClick}>Emergency Numbers</button>
            <div>
                <p>{emergencyNumbers.disclaimer}</p>
                <div className="ifEmpty">
                    <p><LocalPoliceIcon /> :</p>
                    <p>{police}</p>
                </div>

                <div className="ifEmpty">
                    <p><LocalHospitalIcon /> :</p>
                    <p>{ambulance}</p>
                </div>

                <div className="ifEmpty">
                    <p><FireTruckIcon /> :</p>
                    <p>{fire}</p>
                </div>

                <div className="ifEmpty">
                    <p><LocalPoliceIcon /> <LocalHospitalIcon /> <FireTruckIcon /> :</p>
                    <p>{dispatch}</p>
                </div>
            </div>
        </div>
    )
}
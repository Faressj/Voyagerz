import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/ProfilePage.scss';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${process.env.REACT_APP_API_URL}user-info`, { headers: { Authorization: token } })
      .then(response => setUserInfo(response.data))
      .catch(error => console.log(error));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => {
      navigate('/');
      window.location.reload(false);
    }, 1);
  };

  const handlePasswordUpdate = () => {
    const token = localStorage.getItem('token');
    axios.put(`${process.env.REACT_APP_API_URL}update-password`, { newPassword }, { headers: { Authorization: token } })
      .then(() => alert('Password updated successfully'))
      .catch(error => console.log(error));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-container">
      <div className="top-buttons">
        <button className="btn-return" onClick={handleGoBack}>
          <img src="/assets/return-arrow.svg" alt="Retour" />
          Retour
        </button>
        <button className="btn-logout" onClick={handleLogout}>Se déconnecter</button>
      </div>
      <h1>Bonjour, {userInfo.name}!</h1>
      <h2>Votre Email: {userInfo.email}</h2>
      <div className="password-section">
        <input
          type='password'
          placeholder='Modifier Votre Mot de Passe'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordUpdate}>Mettre à Jour</button>
      </div>
    </div>
  );
};

export default ProfilePage;

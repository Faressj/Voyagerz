import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogSign from './pages/LogSign';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';  // Assurez-vous que le chemin est correct
import TodoList from './pages/TodoListPage';


function App()  {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route exact path='/' element={token ? <HomePage /> : <LogSign />} />

        <Route path='/signup' element={token ? <ProfilePage /> : <SignUpPage />} />
        <Route path='/login' element={token ? <ProfilePage /> : <LoginPage />} />
        <Route path='/profil' element={token ? <ProfilePage /> : <LoginPage />} />
        <Route path='/list' element={token ? <TodoList /> : <LoginPage />} />
      </Routes>
    </Router>
  );
};
export default App;
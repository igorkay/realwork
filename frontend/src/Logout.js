import React, { useState } from 'react';
import api from './api';

function Logout() {
    const handleLogout = () => {
      localStorage.removeItem('token'); // Или ключ, под которым ты хранишь токен
      window.location.href = '/login'; // Перенаправляем на страницу входа
    };
  
    return (
      <button onClick={handleLogout} className="text-red-500 font-bold">
        Выйти
      </button>
    );
  }

  export default Logout;
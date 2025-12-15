// LÍNIA ELIMINADA: import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderColorDetail.css';
// NOU: Importem el hook del Context
import { useTheme } from '../context/ThemeContext'; 

function HeaderColorDetail({ colorHex }) {

  // NOU: Obtenim l'estat i la funció del Context
  const { isDarkMode, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

const handleReturn = () => {
    navigate('/');
  };

  return (
    <div className={`header-detail ${isDarkMode ? 'dark' : ''}`}>
      <div className="left-group">
      <button className="return-button" onClick={handleReturn}>
          <img src="/icons/return.svg" alt="Tornar" />
        </button>
      </div>

      <div className="header-detail-title">
        <h1>{colorHex ? colorHex.toUpperCase() : '#??????'}</h1>
      </div>

      <div className="right-group">
        <label className="switch">
          {/* NOU: Utilitzem l'estat global isDarkMode i la funció toggleTheme */}
          <input 
              type="checkbox" 
              checked={isDarkMode} 
              onChange={toggleTheme} 
          />
          <span className="slider round"></span>
      </label>
    </div>
  </div>
  );
}

export default HeaderColorDetail;
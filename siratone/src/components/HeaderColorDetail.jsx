import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderColorDetail.css';

function HeaderColorDetail({ colorHex }) {
  // Lógica de Dark Mode replicada
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  
  // Función para volver a la página anterior (Home)
  const handleReturn = () => {
      navigate('/');
  };

  return (
    <div className="header-detail">
      
      <button className="return-button" onClick={handleReturn}>
        <img src="/icons/return.svg" alt="Tornar" />
      </button>

      <h1 className="header-detail-title">{colorHex ? colorHex.toUpperCase() : '#??????'}</h1>
      
      <label className="switch">
        <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default HeaderColorDetail;
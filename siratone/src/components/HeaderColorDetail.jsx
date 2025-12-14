import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderColorDetail.css';

function HeaderColorDetail({ colorHex }) {

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
  
  const handleReturn = () => {
      navigate('/');
  };

  return (
    <div className="header-detail">
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
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span>
        </label>
      </div>
      
    </div>
  );
}

export default HeaderColorDetail;
// Header.jsx

// LÍNIA ELIMINADA: import { useState } from 'react';
import './Header.css';
// NOU: Importem el hook del Context des de la seva ubicació
import { useTheme } from '../context/ThemeContext'; // <<< CANVI CLAU

function Header() {
  // ELIMINADA: const [darkMode, setDarkMode] = useState(false);

  // NOU: Obtenim l'estat i la funció del Context
  const { isDarkMode, toggleTheme } = useTheme(); // <<< CANVI CLAU

  /*
  FUNCIÓ ELIMINADA:
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // NOTA: Tota aquesta lògica de classList.add/remove s'ha mogut
    // a l'arxiu ThemeContext.jsx, dins de l'useEffect, i es gestiona globalment.
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };
  */

  return (
    <div className="header">
      <h1 className="header-title">Home</h1>
      <label className="switch">
        {/* NOU: Utilitzem l'estat global isDarkMode i la funció toggleTheme */}
        <input 
          type="checkbox" 
          checked={isDarkMode} 
          onChange={toggleTheme} // <<< CANVI CLAU
        /> 
        <span className="slider round"></span>
      </label>
    </div>
  );
}

export default Header;
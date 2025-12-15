// src/context/ThemeContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  
  // A. LLEGIR des de localStorage a la inicialització
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Intentem obtenir l'estat guardat (guardem 'true' o 'false')
    const savedMode = localStorage.getItem('app-is-dark-mode'); 
    
    // Si hi ha un valor guardat, el parsegem a booleà; altrament, és false (light) per defecte.
    return savedMode === 'true' ? true : false;
  });

  // B. GUARDAR a localStorage i Aplicar Classe al Body
  useEffect(() => {
    // 1. Guardem el nou estat (com a string 'true' o 'false') a localStorage
    localStorage.setItem('app-is-dark-mode', String(isDarkMode));
    
    // 2. Apliquem la classe 'dark-mode' al body (tal com ja feies als Headers)
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
  }, [isDarkMode]); 

  // La funció per canviar l'estat
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 3. El Hook per consumir-ho fàcil
export const useTheme = () => useContext(ThemeContext);
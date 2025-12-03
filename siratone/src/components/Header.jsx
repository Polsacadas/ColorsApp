
import { useTheme } from './ThemeContext'; 
import './Header.css';

function Header() {

  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      marginBottom: '20px',
      borderBottom: '1px solid #ccc'
    }}>
      <h1>La Meva App ({theme})</h1>
      
      {/* Botó que modifica l'estat global */}
      <button onClick={toggleTheme}>
        Canviar a {theme === 'light' ? 'Fosc 🌙' : 'Clar ☀️'}
      </button>
    </header>
  );
}

export default Header;

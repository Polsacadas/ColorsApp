import './Footer.css';
import { Link, useLocation } from 'react-router-dom'; 

function Footer() {
    const location = useLocation();
    const currentPath = location.pathname;
    const isFavoritesActive = currentPath === '/FavoritesPage';
    
    return (
      <div className="footer">
        <div 
        className={`active-indicator ${isFavoritesActive ? 'is-active-favorites' : 'is-active-home'}`}
        ></div>
        <Link to="/" className="footer-button"> 
          <img src="/icons/home.svg" alt="Home" />
        </Link>
        <Link to="/FavoritesPage" className="footer-button"> 
          <img src="/icons/save.svg" alt="Guardados" />
        </Link>
      </div>
      );
}

export default Footer;
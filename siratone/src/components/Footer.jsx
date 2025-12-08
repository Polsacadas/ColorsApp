import './Footer.css';
import { Link } from 'react-router-dom'; //------------
  
function Footer() {
    return (
      <div className="footer">
        <Link to="/" className="footer-button"> {/* Link para Home */}
          <img src="/icons/home.svg" alt="Home" />
        </Link>
        <Link to="/FavoritesPage" className="footer-button"> {/* Link para Favorits */}
          <img src="/icons/save.svg" alt="Guardados" />
        </Link>
      </div>
    );
}

export default Footer;
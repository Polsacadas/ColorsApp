import { useFavorites } from '../context/FavoritesContext'; // IMPORTEM EL HOOK
import { Link } from "react-router-dom"; // Assegurem que Link està importat
import './FavoritesPage.css';

function FavoritesPage() {
const { favorites, toggleFavorite } = useFavorites(); // USEM EL HOOK (CONECTAMOS AL CONTEXT AQUII)

//SI NO HAY FAPS AUN
  if (favorites.length === 0) {
    return (
      <div className="detail-container">
      <h2>No tens favorits encara...</h2>
      <Link to="/" className="back-btn"> Tornar </Link>
      </div>
    );
  }

  //SI HAY FAPS
  return (
    <div className="posts-grid">
    <h2>MIS FAPS ({favorites.length}) </h2>

    {favorites.map((post) => (
             <li
              key={post.id}
              className="post-item"
              style={{
                // usa post.gridHeight si existe, si no, 'span 2' por default
              gridRowEnd: `span ${post.gridHeight || 2}`
              }}
            >
              <Link
                to={`/post/${post.hex.replace('#', '')}`}
                style={{ display: "flex", width: "100%" }}>
                  
                  {/* color box */}
                <div className="color-box" style={{ backgroundColor: post.rgb }}>      

                    {/* save icon - Para eliminar tmb desde faps */}
                    <button
                      className="save-button is-favorite" 
                      onClick={(e) => {
                        e.preventDefault();     
                        e.stopPropagation();    
                        toggleFavorite(post);
                      }}
                    >
                      <img src="/icons/save-filled.svg" alt="Treure de Favorits" />
                    </button>

                    {/* Texto HEX  */}
                    <span className="hex-text">{post.hex}</span>
                </div>
              </Link>          
            </li>
        ))}
        
        </div>
      )}



export default FavoritesPage;
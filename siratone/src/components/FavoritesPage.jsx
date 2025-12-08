import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from "react-router-dom";
import './FavoritesPage.css';

function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();
  
  // ESTADO: 'colors' es el valor inicial (por defecto)
  const [activeTab, setActiveTab] = useState('colors'); 

  return (
    <div className="favorites-page-container">
      
      {/* CABECERA Y PESTAÑAS */}
      <div className="fav-header">
        <h2>MIS FAVORITOS</h2>
        
        <div className="fav-tabs">
          {/* Botón Colores */}
          <button 
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            Colors ({favorites.length})
          </button>
          
          {/* Botón Paletas */}
          <button 
            className={`tab-btn ${activeTab === 'palettes' ? 'active' : ''}`}
            onClick={() => setActiveTab('palettes')}
          >
            Paletes
          </button>
        </div>
      </div>

      {/* --- CONTENIDO: COLORES --- */}
      {activeTab === 'colors' && (
        <>
          {favorites.length === 0 ? (
            <div className="empty-message">
              <h3>Encara no hi ha colors...</h3>
              <Link to="/" className="back-btn" style={{marginTop: '20px', display:'inline-block'}}> 
                Explorar colors 
              </Link>
            </div>
          ) : (
            <div className="favorites-grid">
              {favorites.map((post) => (
                <li key={post.id} className="post-item">
                  <Link
                    to={`/post/${post.hex.replace('#', '')}`}
                    style={{ display: "block", width: "100%", height: "100%" }}
                  >
                    <div className="color-box" style={{ backgroundColor: post.rgb }}>      
                      <button
                        className="save-button" 
                        onClick={(e) => {
                          e.preventDefault();     
                          e.stopPropagation();    
                          toggleFavorite(post);
                        }}
                      >
                        <img src="/icons/save-filled.svg" alt="Quitar Favorito" />
                      </button>
                      <span className="hex-text">{post.hex}</span>
                    </div>
                  </Link>          
                </li>
              ))}
            </div>
          )}
        </>
      )}

      {/* --- CONTENIDO: PALETAS --- */}
      {activeTab === 'palettes' && (
        <div className="empty-message">
          <h3>Paletes guardades</h3>
          <p>Cap paleta guardada</p>
        </div>
      )}

    </div>
  );
}

export default FavoritesPage;
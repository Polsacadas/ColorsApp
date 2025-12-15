import { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext';
import { Link } from "react-router-dom";
import './FavoritesPage.css';

function FavoritesPage() {
  const { favorites, toggleFavorite, favPalettes, toggleFavoritePalette } = useFavorites();
  
  // ESTADO: 'colors' es el valor inicial (por defecto)
  const [activeTab, setActiveTab] = useState('colors'); 

  return (
    <div className="favorites-page-container">
      
      {/* CABECERA Y PESTAÑAS */}
      <div className="fav-header">
        <h2>My favourites</h2>
        
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
            Paletes ({favPalettes.length})
          </button>
        </div>
      </div>

      {/* --- CONTENIDO COLORES --- */}
      {activeTab === 'colors' && (
        <>
          {favorites.length === 0 ? ( //Si NO hi ha colors guardats
            <div className="empty-message">
              <h3>Encara no hi ha colors...</h3>
              <Link to="/" className="back-btn" style={{marginTop: '20px', display:'inline-block'}}> 
                Explorar colors 
              </Link>
            </div>
          ) : (//SI hi ha colors guardats
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

      {/* --- CONTENIDO PALETAS --- */}
      {activeTab === 'palettes' && (
        <>
          {favPalettes.length === 0 ? ( //Si NO hi ha paletes guardades
            <div className="empty-message">
              <h3>No hi ha paletes guardades</h3>
              <Link to="/" className="back-btn" style={{marginTop: '20px', display:'inline-block'}}> 
                Explorar colors 
              </Link>
            </div>
          ) : ( //SI hi ha paletes guardades

            <div className="palettes-grid"> 
              
              {favPalettes.map((pal) => (
                <div key={pal.id} className="palette-wrapper"> 
                  
                  {/* NOM COLOR + BOTÓ ESBORRAR */}
                  <div className="palette-header-row">
                     <span className="palette-base-label">BASE: #{pal.baseColor}</span>
                     <button 
                        className="palette-delete-btn" 
                        onClick={() => toggleFavoritePalette(pal)}
                        title="Esborrar paleta"
                      >

                        {/* BRIGHTNESS PER CANVIAR ICONA BLANC A NEGRE. S'HA DE CANVIAR PEL DARKMODE */}
                        <img src="/icons/save-filled.svg" alt="Esborrar" style={{filter: 'brightness(0)'}} /> 
                     </button>
                  </div>

                  {/* TIRA ARRODONIDA HORITZONTAL */}
                  <div className="palette-strip"> 
                    {pal.colors.map((c, i) => (
                      <Link 
                        key={i} 
                        to={`/post/${c.hex.value.replace('#', '')}`}
                        className="palette-strip-item" 
                        style={{ backgroundColor: c.hex.value }}
                        title={`Veure color ${c.hex.value}`}
                      >              
                        <span className="palette-item-hex">
                          {c.hex.value.replace('#', '')}
                        </span>
                      </Link>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FavoritesPage;
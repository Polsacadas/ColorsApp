import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ColorDetail.css';
import { useFavorites } from '../context/FavoritesContext'; 
import HeaderColorDetail from './HeaderColorDetail';
// NOU: Importem el hook del Context
import { useTheme } from '../context/ThemeContext'; // <<< CANVI CLAU

function ColorDetail() {
  const { id } = useParams();
  const [colorData, setColorData] = useState(null);

  // Paleta + control para reiniciar animaciones
  const [palette, setPalette] = useState(null);
  const [loadingPalette, setLoadingPalette] = useState(false);
  const [paletteError, setPaletteError] = useState(null);
  const [paletteVersion, setPaletteVersion] = useState(0); // para forzar nuevo key y reiniciar anims
  
  const [paletteCount, setPaletteCount] = useState(0); //hago el contador para meter el numero de paleta generada

  // NOU: Obtenim l'estat del tema
  const { isDarkMode } = useTheme(); // <<< CANVI CLAU
  
  useEffect(() => {
    setPalette(null);
    setPaletteVersion(0);
     setPaletteError(null);
    fetch(`https://www.thecolorapi.com/id?hex=${id}`)
      .then((res) => res.json())
    .then((data) => {
        setColorData(data);
      })
      .catch((error) => console.error("Error cargando color:", error));
  }, [id]); // El efecto se ejecuta cada vez que 'id' cambia

  const MODES = [
    "analogic",
    "monochrome",
    "monochrome-dark",
    "monochrome-light",
    "triad",
    "quad"
  ];
  const generatePalette = () => {
    if (!colorData) return;
    setLoadingPalette(true);
    setPaletteError(null);

    const randomMode = MODES[Math.floor(Math.random() * MODES.length)];

    fetch(`https://www.thecolorapi.com/scheme?hex=${id}&mode=${randomMode}&count=5`)
      .then((res) => res.json())
      .then((data) => {
        const mainHex = colorData.hex.value.toUpperCase();
        const remoteColors = Array.isArray(data.colors) ? data.colors : [];
        
        const filtered = remoteColors.filter(
        (c) => c.hex && c.hex.value.toUpperCase() !== mainHex
      );

        // solo 5 colores
        setPalette(filtered.slice(0, 5));

        setPaletteVersion((v) => v + 1);     // animaciones
        setPaletteCount((c) => c + 1);
      })
    .catch((err) => {
        console.error(err);
        setPaletteError("Error generating palette");
      })
      .finally(() => setLoadingPalette(false));
  };

  const getComplementaryColor = (rgb) => {
    const r = 255 - rgb.r;
    const g = 255 - rgb.g;
    const b = 255 - rgb.b;

    const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase();

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

//----------------------------------------------------------------------------
  const { toggleFavorite, isFavorite, toggleFavoritePalette, isFavoritePalette } = useFavorites(); 
//---------------------------------------------------------------------------

  if (!colorData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Carregant informació...</h2>
      </div>
    );
  }

//----------------------------------------------------------------------

// Lògica per a Favorits Colors

const post = colorData ? {
    id: id, 
    hex: colorData.hex.value, 
    rgb: colorData.rgb.value 
} : null;

const isCurrentFavorite = post ? isFavorite(post.id) : false;


// Lògica per a Favorits Paletta

const paletteId = `palette-${id}-${paletteCount}`; // tiene en cuenta el id de la paleta Y EL NUMERO DE PALETA 1,2,3...
const isFavPalette = isFavoritePalette(paletteId); //Comprovar si esta guardat


const currentPaletteObj = {
  id: paletteId,
  baseColor: id,
  number: paletteCount,
  colors: palette
};





//----------------------------------------------------------------------  

  const complementaryHex = getComplementaryColor(colorData.rgb);

  // NOU: Definim les classes condicionals
  const detailContainerClass = isDarkMode ? 'detail-container dark' : 'detail-container'; // Per al fons de la vista
  const detailCardClass = isDarkMode ? 'detail-card dark' : 'detail-card'; // Per a la targeta principal

  return (
  <div className="detail-container">

      {/* <Link to="/" className="back-btn">
        Tornar
      </Link> */}
<HeaderColorDetail colorHex={colorData.hex.value}></HeaderColorDetail>
      <div className="detail-card">
        {/* COLOR */}
        <div
          className="color-swatch-container"
          style={{ backgroundColor: colorData.hex.value }}
        >
          {post && ( 
            <button 
              className={`save-button ${isCurrentFavorite ? 'is-favorite' : ''}`}
              onClick={() => toggleFavorite(post)} 
              >
                <img 
                src={isCurrentFavorite ? "/icons/save-filled.svg" : "/icons/save.svg"} 
                alt={isCurrentFavorite ? "Treure de Favorits" : "Guardar a Favorits"} 
              />
              </button>
            )}

          <div className="overlay-info">
            <div className="detail-info">
            <p><strong>HEX:</strong> {colorData.hex.value}</p>
            <p><strong>RGB:</strong> {colorData.rgb.value}</p>
            </div>
          </div>
        </div>

{/* COLOR COMPLEMENTARIO */}
        <div className="complementario-container">
          <div className="complementario-text">
            <span>Complementary</span>
            <span>color</span>
        </div>

          <Link to={`/post/${complementaryHex.replace('#', '')}`}  
          className="complementario-rect"
          style={{ backgroundColor: complementaryHex }}>
            
          <span className="complementario-hex">{complementaryHex}</span>
          </Link>

        </div>

{/* GENERADOR DE PALETA*/}

  <div className="palette-generator">
    <div className={`palette-controls ${palette ? 'palette-generated' : ''}`}>
      
      {palette && (
        // AFEGIM CONTENIDOR FLEX PER AL TÍTOL I EL BOTÓ
        <div className="palette-header"> 
          <span className="palette-title">
            Palette {paletteCount || 1}
          </span>
                 
          {/* CANVI 2: Fem servir la classe "save-palette-btn" en lloc de "save-button" */}
          <button
            className="save-palette-btn"
            disabled={!palette}
            onClick={() => toggleFavoritePalette(currentPaletteObj)}>
              
            <img 
              src={isFavPalette ? "/icons/save-filled.svg" : "/icons/save.svg"} 
              alt="Guardar Paleta"
              // Afegim el filtre per si de cas la icona és blanca
              style={{filter: 'brightness(0)'}} 
            />
          </button>
        </div>
      )}
      
      <button 
        className="palette-button" 
        onClick={generatePalette} 
        disabled={loadingPalette}
      >
        {palette ? (
          <img 
              src="/icons/reload.svg" 
              alt="Regenerar Paleta" 
              className="reload-icon"
          />
        ) : (
          'Generate Palette'
        )}
      </button>
    </div>
  </div>

        

          {loadingPalette && <p></p>}
          {paletteError && <p>{paletteError}</p>}

          {/* PALETA: se renderiza en un contenedor fijo bottom; key={paletteVersion} reinicia anim */}
          {palette && (
            <div className="palette-container" key={`palette-${paletteVersion}`}>
              {palette.map((col, index) => (
                <div
                  key={col.hex.value + index}
                  className="palette-color"
                  style={{
                    backgroundColor: col.hex.value,
                    // stagger animation: index * 120ms
                    animationDelay: `${index * 120}ms`,
                  }}
                  >
                  <span className="palette-hex">{col.hex.value}</span>
                </div>
                ))}
            </div>
          )}
    </div>
  </div>
  );
}

export default ColorDetail;
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ColorDetail.css';
import { useFavorites } from '../context/FavoritesContext'; // LLAMA EL HOOK AQUIIIIIIIIIIIIII

function ColorDetail() {
  const { id } = useParams();
  const [colorData, setColorData] = useState(null);

  // Paleta + control para reiniciar animaciones
  const [palette, setPalette] = useState(null);
  const [loadingPalette, setLoadingPalette] = useState(false);
  const [paletteError, setPaletteError] = useState(null);
  const [paletteVersion, setPaletteVersion] = useState(0); // para forzar nuevo key y reiniciar anims

  useEffect(() => {
    fetch(`https://www.thecolorapi.com/id?hex=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setColorData(data);
      })
      .catch((error) => console.error("Error cargando color:", error));
  }, [id]);

  const generatePalette = () => {
    if (!colorData) return;
    setLoadingPalette(true);
    setPaletteError(null);
  
    fetch(`https://www.thecolorapi.com/scheme?hex=${id}&mode=analogic&count=5`)
      .then((res) => res.json())
      .then((data) => {
        const mainHex = colorData.hex.value.toUpperCase();
        const remoteColors = Array.isArray(data.colors) ? data.colors : [];
  
        // Filtramos el color principal si ya está en la paleta
        const filtered = remoteColors.filter(
          (c) => c.hex && c.hex.value.toUpperCase() !== mainHex
        );
  
        // Tomamos solo los primeros 5 colores
        const paletteFive = filtered.slice(0, 5);
  
        setPalette(paletteFive);
        setPaletteVersion((v) => v + 1);
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
  const { toggleFavorite, isFavorite } = useFavorites(); //las variables de faps
  
//---------------------------------------------------------------------------

  if (!colorData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Carregant informació...</h2>
      </div>
    );
  }

//----------------------------------------------------------------------
// Lògica per a Favorits
// Creem l'objecte 'post' amb la informació necessària per al context de favorits
const post = colorData ? {
    id: id, // L'ID ja és el HEX sense '#'
    hex: colorData.hex.value, // El valor HEX complet
    rgb: colorData.rgb.value // El valor RGB per si de cas
    // Aquí podries afegir altres dades si les necessites per a FavoritesPage
} : null;

// Comprovem si l'element actual és favorit
const isCurrentFavorite = post ? isFavorite(post.id) : false;
//----------------------------------------------------------------------  

  const complementaryHex = getComplementaryColor(colorData.rgb);

  return (
    <div className="detail-container">

      <Link to="/" className="back-btn">
        Tornar
      </Link>

      <div className="detail-card">
        {/* COLOR */}
        <div
          className="color-swatch-container"
          style={{ backgroundColor: colorData.hex.value }}
        >
{/*----------------------------------------------------------*/}
          {post && ( // Només renderitzem si tenim l'objecte post (colorData)
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
{/*----------------------------------------------------------*/}

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

          <Link 
            to={`/post/${complementaryHex.replace('#', '')}`} 
            className="complementario-rect"
            style={{ backgroundColor: complementaryHex }}
          >
            <span className="complementario-hex">{complementaryHex}</span>
          </Link>

        </div>

        {/* GENERADOR DE PALETA */}
        <div className="palette-generator">
          <button className="palette-button" onClick={generatePalette}>
            Generate Palette
          </button>
        </div>

        {loadingPalette && <p>Generating palette...</p>}
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

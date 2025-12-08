import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ColorDetail.css';

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

  if (!colorData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Carregant informació...</h2>
      </div>
    );
  }

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
          <button className="save-button">
            <img src="/icons/save.svg" alt="Guardar" />
          </button>

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

          <div className="complementario-rect" style={{ backgroundColor: complementaryHex }}>
            <span className="complementario-hex">{complementaryHex}</span>
          </div>
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

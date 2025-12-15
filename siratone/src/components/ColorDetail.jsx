import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import './ColorDetail.css';
import { useFavorites } from '../context/FavoritesContext'; 
import HeaderColorDetail from './HeaderColorDetail';
import { useTheme } from '../context/ThemeContext';

function ColorDetail() {
  const { id } = useParams();
  const [colorData, setColorData] = useState(null);

  const [palette, setPalette] = useState(null);
  const [loadingPalette, setLoadingPalette] = useState(false);
  const [paletteError, setPaletteError] = useState(null);
  const [paletteVersion, setPaletteVersion] = useState(0);
  const [paletteCount, setPaletteCount] = useState(0);

  const { isDarkMode } = useTheme();
  const { toggleFavorite, isFavorite, toggleFavoritePalette, isFavoritePalette } = useFavorites();

  useEffect(() => {
    setPalette(null);
    setPaletteVersion(0);
    setPaletteError(null);

    fetch(`https://www.thecolorapi.com/id?hex=${id}`)
      .then(res => res.json())
      .then(data => setColorData(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!colorData) {
    return (
      <div className="detail-container">
        <h2>Carregant informació...</h2>
      </div>
    );
  }

  const post = {
    id,
    hex: colorData.hex.value,
    rgb: colorData.rgb.value
  };

  const isCurrentFavorite = isFavorite(post.id);

  const MODES = ["analogic", "monochrome", "monochrome-dark", "monochrome-light", "triad", "quad"];

  const generatePalette = () => {
    const randomMode = MODES[Math.floor(Math.random() * MODES.length)];
    setLoadingPalette(true);

    fetch(`https://www.thecolorapi.com/scheme?hex=${id}&mode=${randomMode}&count=5`)
      .then(res => res.json())
      .then(data => {
        const mainHex = colorData.hex.value.toUpperCase();
        const filtered = data.colors.filter(
          c => c.hex.value.toUpperCase() !== mainHex
        );
        setPalette(filtered.slice(0, 5));
        setPaletteVersion(v => v + 1);
        setPaletteCount(c => c + 1);
      })
      .catch(() => setPaletteError("Error generating palette"))
      .finally(() => setLoadingPalette(false));
  };

  const getComplementaryColor = (rgb) => {
    const toHex = v => v.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(255 - rgb.r)}${toHex(255 - rgb.g)}${toHex(255 - rgb.b)}`;
  };

  const complementaryHex = getComplementaryColor(colorData.rgb);

  const paletteId = `palette-${id}-${paletteCount}`;
  const isFavPalette = isFavoritePalette(paletteId);

  const currentPaletteObj = {
    id: paletteId,
    baseColor: id,
    number: paletteCount,
    colors: palette
  };

  // 🔥 CLASSES DARK MODE
  const detailContainerClass = isDarkMode ? 'detail-container dark' : 'detail-container';
  const detailCardClass = isDarkMode ? 'detail-card dark' : 'detail-card';

  return (
    <div className={detailContainerClass}>
      <HeaderColorDetail colorHex={colorData.hex.value} />

      <div className={detailCardClass}>

        {/* COLOR PRINCIPAL */}
        <div
          className="color-swatch-container"
          style={{ backgroundColor: colorData.hex.value }}
        >
          <button
            className={`save-button ${isCurrentFavorite ? 'is-favorite' : ''}`}
            onClick={() => toggleFavorite(post)}
          >
            <img
              src={isCurrentFavorite ? "/icons/save-filled.svg" : "/icons/save.svg"}
              alt="Guardar color"
            />
          </button>

          <div className="overlay-info">
            <p><strong>HEX:</strong> {colorData.hex.value}</p>
            <p><strong>RGB:</strong> {colorData.rgb.value}</p>
          </div>
        </div>

        {/* COLOR COMPLEMENTARI */}
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
          <div className={`palette-controls ${palette ? 'palette-generated' : ''}`}>
            {palette && (
              <div className="palette-header">
                <span className="palette-title">Palette {paletteCount}</span>

                <button
                  className="save-palette-btn"
                  onClick={() => toggleFavoritePalette(currentPaletteObj)}
                >
                  <img
                    src={isFavPalette ? "/icons/save-filled.svg" : "/icons/save.svg"}
                    alt="Guardar Paleta"
                    style={{ filter: isDarkMode ? 'brightness(1)' : 'brightness(0)' }}
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
                <img src="/icons/reload.svg" alt="Reload" />
              ) : (
                'Generate Palette'
              )}
            </button>
          </div>
        </div>

        {palette && (
          <div className="palette-container" key={paletteVersion}>
            {palette.map((col, i) => (
              <div
                key={i}
                className="palette-color"
                style={{
                  backgroundColor: col.hex.value,
                  animationDelay: `${i * 120}ms`
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

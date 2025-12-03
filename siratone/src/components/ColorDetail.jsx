import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import './ColorDetail.css';

function ColorDetail() {
  // 1. Recibimos el ID de la URL (ej: "61FD88")
  const { id } = useParams();
  
  // 2. Estado para guardar los datos que vendrán de internet
  const [colorData, setColorData] = useState(null);

  //Datos para las paletas:
  const [palette, setPalette] = useState(null);
  const [loadingPalette, setLoadingPalette] = useState(false);
  const [paletteError, setPaletteError] = useState(null);


  useEffect(() => {
    
    fetch(`https://www.thecolorapi.com/id?hex=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setColorData(data);
      })
      .catch((error) => console.error("Error cargando color:", error));
  }, [id]); 

  const generatePalette = () => {
    setLoadingPalette(true);
    setPaletteError(null);

    fetch(`https://www.thecolorapi.com/scheme?hex=${id}&mode=analogic&count=5`)
      .then((res) => res.json())
      .then((data) => {
        setPalette(data.colors); // array de colores
      })
      .catch(() => setPaletteError("Error generating palette"))
      .finally(() => setLoadingPalette(false));
  };

  if (!colorData) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>Carregant informació...</h2>
      </div>
    );
  }


  return (
    <div className="detail-container">
       <Link to="/" className="back-btn">
          Tornar
        </Link>
      <div className="detail-card">
        
       
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

       <div>
        <p>Complementary color:</p>
       </div>
        <div className ="palette-generator">
      <button className="palette-button" onClick={generatePalette}>
                Generatte Palette
              </button>
      </div>
        {loadingPalette && <p>Generating palette...</p>}
        {paletteError && <p>{paletteError}</p>}

        {palette && (
          <div className="palette-container">
            {palette.map((col) => (
              <div 
                key={col.hex.value}
                className="palette-color"
                style={{ backgroundColor: col.hex.value }}
              >
                <span>{col.hex.value}</span>
              </div>
            ))}
          </div>
        )}
    </div>
    </div>

   
  );
}




export default ColorDetail;
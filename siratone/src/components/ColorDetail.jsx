import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import './ColorDetail.css';

function ColorDetail() {
  // 1. Recibimos el ID de la URL (ej: "61FD88")
  const { id } = useParams();
  
  // 2. Estado para guardar los datos que vendrán de internet
  const [colorData, setColorData] = useState(null);

  useEffect(() => {
    
    fetch(`https://www.thecolorapi.com/id?hex=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setColorData(data);
      })
      .catch((error) => console.error("Error cargando color:", error));
  }, [id]); 

 
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
      <button className="palette-button">
                Generatte Palette
              </button>
      </div>
       
    </div>
    </div>

   
  );
}




export default ColorDetail;
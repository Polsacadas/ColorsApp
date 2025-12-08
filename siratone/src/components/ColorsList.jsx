import { useState, useEffect } from 'react';
import './ColorsList.css';
//import './PostList.css'; // Importem el CSS mobile-first
import {Link } from 'react-router-dom'; 
import { useFavorites } from '../context/FavoritesContext'; // 1. IMPORTEM EL HOOK AQUUIIIIIII

// URL de l'API que farem servir
const API_URL = 'https://x-colors.yurace.pro/api/random?number=250';


function ColorsList() {
    //const navigate = useNavigate(); no cal ---------------------------------------------

    const { toggleFavorite, isFavorite } = useFavorites(); // 2. UTILITZEM EL HOOK

  // --- ESTATS ---
  // 1. Els 3 estats per a la càrrega de dades
  const [posts, setPosts] = useState(null); // 'null' per saber que no s'ha carregat res
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // --- EFECTE SECUNDARI ---
  // S'executa només un cop (array de dependències buit [])
  useEffect(() => {
    
    // Definim la funció async a dins de l'efecte
    const fetchPosts = async () => {
      try {
        const response = await fetch(API_URL);
        // Gestionem errors de la resposta (ex: 404, 500)
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        const postsWithHeight = data.map(post => ({
          ...post, //Mantiene propiedades existebtes
          gridHeight: Math.floor(Math.random() * 3) + 2 //Guardamos height
        }));
        //console.log(data);
        setPosts(postsWithHeight); // 1. Guardem les dades amb l'alçada inclosa
      } catch (err) {
        setError(err.message); // 2. Guardem l'error
      } finally {
        setLoading(false); // 3. Deixem de carregar (tant si hi ha èxit com error)
      }
    };
    
    fetchPosts(); // Cridem la funció que acabem de definir
    
    
  }, []); // <-- Array buit = "executa't només un cop al muntar"


  
  // --- LÒGICA DE RENDERITZAT ---
  
  // 1. Renderitzat condicional (gestió d'estats de càrrega)
  if (loading) {
    return <p>Carregant colors...</p>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }


  return (
    <div className="post-list-container">
                                                            {/* DIV DE FLITROS SUPERIORES */}
      <div className = "filters-containers">
        <button className = "btn-filter">Inicio</button>
        <button className = "btn-filter">Green</button>
        <button className = "btn-filter">Red</button>
        <button className = "btn-filter">Yellow</button>
        <button className = "btn-filter">Blue</button>
        <button className = "btn-filter">Purple</button>
      </div>
                                                            {/* DIV DE GRID DE COLORES */}     
      <div className="posts-grid">
        
        {posts.map((post) => {

          // --- 1. DECLARACIÓ DE VARIABLES DINS DEL MAP ---
        // Creem l'objecte necessari per a FavoritesContext
        const favoriteItem = {
            id: post.hex.replace('#', ''), // Usem el hex sense '#' com a ID
            hex: post.hex,
            rgb: post.rgb
        };
        // Comprovem l'estat
        const isFav = isFavorite(favoriteItem.id);

        return ( // AFEGIM RETURN
          <li
            key={post.hex}
            className="post-item"
            style={{
              gridRowEnd: `span ${post.gridHeight}` //VaLor guardado antes (con altura)
              //gridRowEnd: `span ${Math.floor(Math.random() * 3) + 2}` // 2 a 4 filas (HAY QUE HABLARLO)
            }}
          >
          <Link
              to={`/post/${post.hex.replace('#', '')}`}
            style={{ display: "flex", width: "100%" }}
>
            {/* color box */}
            <div className="color-box" style={{ backgroundColor: post.rgb }}>
              
              {/* save icon */}
              <button className="save-button">
              <img src="/icons/save.svg" alt="Guardar" />
              </button>

              {/* Texto HEX  */}
              <span className="hex-text">{post.hex}</span>
            </div>

            </Link>          
          </li>
        );
        })}
      </div>

    </div>
  );
}

export default ColorsList;
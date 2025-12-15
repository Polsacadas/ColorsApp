import { useState, useEffect } from 'react';
import './ColorsList.css';
import {Link } from 'react-router-dom'; 
import { useFavorites } from '../context/FavoritesContext'; 

// URL de l'API que farem servir
const API_URL = 'https://x-colors.yurace.pro/api/random?number=250';

// FUNCIÓN DE CLASIFICACIÓN DE COLORES 
// Asigna un nombre de categoría a un color basado en sus valores RGB.
const getColorCategory = (rgbString) => {
    if (rgbString.includes('rgb(')) {
        // Extraer R, G, B de una cadena como "rgb(255, 100, 50)"
        const parts = rgbString.match(/\d+/g);
        if (parts && parts.length >= 3) {
            const r = parseInt(parts[0]);
            const g = parseInt(parts[1]);
            const b = parseInt(parts[2]);
            const total = r + g + b;
            
            // Si es muy oscuro o gris, se considera Neutral/Negro
            if (total < 100) return 'Neutral';
            // Si la diferencia entre R, G, B es muy pequeña, es Gris/Blanco
            if (Math.max(r, g, b) - Math.min(r, g, b) < 40) return 'Neutral';

            // Determinar el canal dominante
            const max = Math.max(r, g, b);

            if (max === r && max > g + 40 && max > b + 40) return 'Red';
            if (max === g && max > r + 40 && max > b + 40) return 'Green';
            if (max === b && max > r + 40 && max > g + 40) return 'Blue';
            
            // Clasificaciones secundarias (más complejas)
            if (r > 150 && g > 150 && b < 100) return 'Yellow'; // Rojo + Verde (sin mucho azul)
            if (r > 150 && b > 150 && g < 100) return 'Purple'; // Rojo + Azul (sin mucho verde)
            if (g > 150 && b > 150 && r < 100) return 'Blue'; // Verde + Azul (tiende a Cian/Azul)
        }
    }
    return 'Other'; // Por defecto
};


function ColorsList() {
   const { toggleFavorite, isFavorite } = useFavorites(); 

 // --- ESTATOS ---
 // 1. Los colores originales cargados (nunca se modifican)
  const [originalPosts, setOriginalPosts] = useState(null); 
 // 2. Los colores que se muestran en la lista (se modifican al filtrar)
  const [posts, setPosts] = useState(null); 
// 3. Estado para el filtro activo (para resaltar el botón)
 const [activeFilter, setActiveFilter] = useState('Inicio');
 
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 
 // --- EFECTO SECUNDARIO (Carga Inicial) ---
   useEffect(() => {

   const fetchPosts = async () => {
        try {
       const response = await fetch(API_URL);
       if (!response.ok) {
         throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();

        // 1. AGREGAMOS CLASIFICACIÓN Y ALTURA
       const classifiedPosts = data.map(post => ({
       ...post, 
          // Clasificamos el color y lo guardamos
          category: getColorCategory(post.rgb), 
          gridHeight: Math.floor(Math.random() * 3) + 2 
       }));

       setOriginalPosts(classifiedPosts); // Guardamos la lista completa
       setPosts(classifiedPosts); // Inicialmente mostramos la lista completa
       } catch (err) {
       setError(err.message); 
      } finally {
      setLoading(false);
     }
   };

   fetchPosts(); 
 
   }, []);


  // --- FUNCIÓN DE FILTRADO ---
  const handleFilterClick = (categoryName) => {
    setActiveFilter(categoryName); // Actualiza el botón activo

    if (categoryName === 'Inicio') {
      // Si es "Inicio", mostramos toda la lista original
      setPosts(originalPosts);
    } else if (originalPosts) {
      // Filtramos la lista original por la categoría seleccionada
      const filtered = originalPosts.filter(post => post.category === categoryName);
      setPosts(filtered);
    }
  };


   // --- RENDERIZADO CONDICIONAL ---
  if (loading) {
   return <p>Carregant colors...</p>;
 }

 if (error) {
   return <div className="error-message">Error: {error}</div>;
 }
  
  // Lista de filtros
  const filterButtons = ['Inicio', 'Green', 'Red', 'Yellow', 'Blue', 'Purple', 'Neutral'];

 return (
   <div className="post-list-container">
 {/* DIV DE FLITROS SUPERIORES */}
 <div className = "filters-containers">
        {/* Mapeamos los botones de filtro */}
        {filterButtons.map((btnName) => (
            <button 
                key={btnName}
                className={`btn-filter ${activeFilter === btnName ? 'active' : ''}`}
                onClick={() => handleFilterClick(btnName)}
            >
                {btnName}
            </button>
        ))}
     </div>
 {/* DIV DE GRID DE COLORES */} 
     <div className="posts-grid">

     {posts && posts.map((post) => { // Aseguramos que 'posts' exista antes de mapear

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
            gridRowEnd: `span ${post.gridHeight}` 
           }}
           >
         <Link
            to={`/post/${post.hex.replace('#', '')}`}
            style={{ display: "flex", width: "100%" }}
          >
       {/* color box */}
           <div className="color-box" style={{ backgroundColor: post.rgb }}>
            
            
            {/* save icon */}

           <button
               className="save-button"
               onClick={(e) => {
               e.preventDefault();  
               e.stopPropagation(); 
                 toggleFavorite(favoriteItem);
               }}
               >
         {/* Mostramos el icono que tocva */}
              <img 
                  src={isFav ? "/icons/save-filled.svg" : "/icons/save.svg"} 
                  alt={isFav ? "Treure de Favorits" : "Guardar a Favorits"} 
               />
            </button>

 {/* Texto HEX  */}
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
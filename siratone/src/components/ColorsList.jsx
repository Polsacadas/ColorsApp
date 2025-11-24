import { useState, useEffect } from 'react';
import './ColorsList.css';

//import './PostList.css'; // Importem el CSS mobile-first

// URL de l'API que farem servir
const API_URL = 'https://x-colors.yurace.pro/api/random?number=25';


function ColorsList() {
  
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
        //console.log(data);
        setPosts(data); // 1. Guardem les dades
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
    return <p>Carregant publicacions...</p>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }


  return (
    <div className="post-list-container">
      <h2>siratone</h2>
  
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post.id} className="post-item">
  
            {/* Quadrat de color */}
            <div className="color-box" style={{ "--color": post.rgb }} />
  
            {/* Text del hex */}
            <h3 className ="color-text"style={{ "--color": post.rgb }}>{post.hex}</h3>
  
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColorsList;
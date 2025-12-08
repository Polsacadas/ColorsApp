import { createContext, useState, useContext } from 'react';

// 1. Creamos el context
const FavoritesContext = createContext();

//2. creamos componente que inyecta los datos
export function FavoritesProvider({children}) {
    const [favorites, setFavorites] = useState([]);

    // Estado para PALETAS
    const [favPalettes, setFavPalettes] = useState([]);

    //toggle per afegir/treure
    const toggleFavorite = (post) => {
        //comprobamos si existe
        const exists = favorites.find(fav => fav.id === post.id);

        if (exists){
            //si ya existe lo ponemos que se pueda sacar (filtramos todos menos este)
            setFavorites(favorites.filter(fav => fav.id !== post.id));
        } else {
            //si no existe, lo añadimos
            setFavorites([...favorites, post]);
        }            
    };

    //funcion para saber si es fav (pintar i despintar el icono de fap)
    const isFavorite = (id) => {
        return favorites.some(fav => fav.id === id);
    };

    // --- LÓGICA PALETAS ---
    const toggleFavoritePalette = (palette) => {
        const exists = favPalettes.find(fav => fav.id === palette.id);
        
        if (exists) {
            // Si ya existe, la quitamos
            setFavPalettes(favPalettes.filter(fav => fav.id !== palette.id));
        } else {
            // Si no existe, la añadimos
            setFavPalettes([...favPalettes, palette]);
        }
    };

    const isFavoritePalette = (id) => {
        return favPalettes.some(fav => fav.id === id);
    };

    //3. Retornamos el Provider con los valores que queremos compatir
    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, favPalettes,
            toggleFavoritePalette, isFavoritePalette }}>
            {children}
        </FavoritesContext.Provider>
    );
}

//4. Hook personalizado para consumirlo facilmente (opcional recomendado)
export const useFavorites = () => useContext(FavoritesContext);
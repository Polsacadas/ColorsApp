// main.jsx (ADAPTAT)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext';
// IMPORTACIÓ NOVA:
import { ThemeProvider } from './context/ThemeContext.jsx'; 


createRoot(document.getElementById('root')).render(
  <StrictMode>
  {/* Envolvem TOT amb el ThemeProvider per a accés global */}
  <ThemeProvider> 
   <FavoritesProvider> 
    <BrowserRouter>
      <App />
    </BrowserRouter> 
   </FavoritesProvider> 
  </ThemeProvider>
 </StrictMode>,
)
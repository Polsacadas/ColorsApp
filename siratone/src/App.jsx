// App.jsx

import { Routes, Route, useLocation } from 'react-router-dom'; 
import ColorsList from './components/ColorsList.jsx';
import ColorDetail from './components/ColorDetail.jsx';
import FavoritesPage from './components/FavoritesPage.jsx';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';


function App() {
  const location = useLocation(); 
  const showGenericHeader = !location.pathname.startsWith('/post/'); 

  return ( 
    <>
      {showGenericHeader && <Header />} 
      
      <Routes>
        <Route path = "/" element ={<ColorsList />}/>
        <Route path = "/post/:id" element ={<ColorDetail />}/> 
        <Route path = "/FavoritesPage" element ={<FavoritesPage />}/>
      </Routes>

      <Footer /> 
    </>
  );
}

export default App;
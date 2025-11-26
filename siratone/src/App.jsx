import ColorsList from './components/ColorsList.jsx'
import ColorDetail from './components/ColorDetail.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import { Routes, Route } from 'react-router-dom'



function App() {
  return ( 
    <>
    <Header /> 
    <Routes>
      <Route path = "/" element ={<ColorsList />}/>
      <Route path = "/post/:id" element ={<ColorDetail />}/>
     
    </Routes>
    <Footer /> 
    </>
    
  )
}

export default App;


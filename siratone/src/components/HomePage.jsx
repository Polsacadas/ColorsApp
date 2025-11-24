import ColorsList from './ColorsList.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'



function HomePage() {
  return ( 
    <>
    <div className="phone-frame">
      <Header /> 
      <ColorsList />
    </div>
    <Footer /> 
    </>
    
  )
}

export default HomePage;
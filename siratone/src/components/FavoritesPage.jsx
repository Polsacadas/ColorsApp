import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";
import './FavoritesPage.css';

function FavoritesPage() {
  return (
    <div className="color-container">
       <Link to="/" className="back-btn">
          Tornar
        </Link>
      <div className="detail-card"> </div>
       
    </div>

   
  );
}




export default FavoritesPage;
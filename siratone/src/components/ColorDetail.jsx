import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function ColorDetail() {
    const {id} = useParams();
    console.log(id);
    const [post, setPost] = useState(null);

    useEffect(()=>{
        fetch(`https://x-colors.yurace.pro/api/random?number=250/post/${id}`)
        .then(res => res.json())
        .then(data => setPost(data));

    }, [id]);

     return (
      
      <h3>hola</h3>
    );
  }
  
  export default ColorDetail;
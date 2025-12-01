import {useEffect, useState} from "react";
import {useParams, Link} from "react-router-dom";

function ColorDetail() {
    const {hex} = useParams();
    console.log("hex");
    const [post, setPost] = useState(null);

    useEffect(()=>{
        fetch(`https://x-colors.yurace.pro/api/random?number=250/post/${hex}`)
        .then(res => res.json())
        .then(data => setPost(data));

    }, [hex]);

     return (
      <>
      <h3>{post.hex}</h3>
      </>
    );
  }
  
  export default ColorDetail;
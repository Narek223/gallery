import React, { useState, useEffect,useRef } from "react";
import {
  FaSearch,
  FaAngleLeft,
  FaAngleRight,
  FaTimes,
  FaThumbsUp,
  FaCalendar,
  FaAngleUp
} from "react-icons/fa";
import "./gallery.css";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import Results from '../No results/Results'


const accessKey= process.env.REACT_APP_UNSPLASH_ACCESS_KEY;




export default function Search() {
  let [img, setimg] = useState([]);
  let [val, setval] = useState("3d renders");
  let [page, setpage] = useState(1);
  let [index, setindex] = useState();
  let [bool, setbool] = useState(false);
  let [total,settotal]=useState()
  let [scroll,setscroll]=useState(false)

let ref= useRef()
  useEffect(() => {
    photo();
  }, [page]);

 
  function photo() {
    let url = `https://api.unsplash.com/photos?`;
    if (val) url = `https://api.unsplash.com/search/photos?query=${val}`;
    url += `&page=${page}`;
    url += `&client_id=${accessKey}`;
    axios(url).then((res) => {
      console.log(res)
      settotal(  res.data.total)
      let a = res.data.results ?? res.data;
      if (page === 1) {
        setimg(a);
        return;
      }
      setimg((img) => [...img, ...a]);
    });
  }

  let blog = (ind) => {
    setindex(ind);
    setbool(true);
  };

  let search = (e) => {
    e.preventDefault();
    setpage(1);
    photo();

  };

  useEffect(()=>{
    let closeblog=(e)=>{
      if(ref.current && !ref.current.contains(e.target))setbool(false)
    }
     document.addEventListener('mousedown',closeblog)
     return ()=>{
     document.removeEventListener('mousedown',closeblog)
     }
  },[bool])

useEffect(()=>{
  if( window.scrollY>=2500){
    setscroll(true)
  }
},[page])

let up=()=>{
window.scrollTo({
  top: 0,
  behavior: "smooth"
})
setscroll(false)
}

  return (
    <div className="conteiner">

      <div className="search">
        <form onSubmit={search}>
          <input
            type="text"
            placeholder="Search"
            value={val}
            onChange={(e) => setval(e.target.value)}
          />
          <button type="submit" onClick={search}>
            <FaSearch className="icon"/>
          </button>
        </form>
      </div>
      
      <p className={` ${  scroll?'icon_up':'none'}`} onClick={up}>< FaAngleUp className="up"/></p>

      {total===0?(<Results/>):(
  <InfiniteScroll
  dataLength={img.length}
  next={() => setpage((page) => page + 1)}
  hasMore={true}
  loader={<span className="load"></span>}
>
  {bool ? (
    
    <div  className="blo">
    
      <div  ref={ref}className="img">
        <p onClick={() => setbool(false)} className="false">
          <FaTimes />
        </p>
        <img src={img[index].urls.regular} />
        <p
          onClick={() =>
            setindex((index) => (index === 0 ? index += 0 : index - 1))
          }
          className="left"
        >
          <FaAngleLeft />
        </p>
        <p
          onClick={() =>
            setindex((index) => (index === img.length - 1 ? 0 : index + 1))
          }
          className="right"
        >
          <FaAngleRight />
        </p>
        <div className="author">
          <h2>AUTHOR:{img[index].user.first_name}</h2>
        
          <p>
            <FaCalendar />{" "}
            {new Date(img[index].created_at).toLocaleDateString()}
          </p>
          <p>
            <FaThumbsUp /> {img[index].likes}
          </p>
        
        </div>
        <div className="ava">
        <img className="avatar" src={img[index].user.profile_image.large}/>
        </div>
      </div>
    </div>
  ) : null}
 
  <div className="gallery">

    {img.map((elem, index) => {
      return (
        <img
          key={index}
          src={elem.urls.regular}
          onClick={() => blog(index)}
        />
      );
    })}

  </div>
</InfiniteScroll>

      )}
 
    </div>
  );
}

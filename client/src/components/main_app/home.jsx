import React, { Component } from "react";
import ArtistIndex from "./artist/artist_index";
import AlbumIndex from "./album/album_index";
import Speech from "../voice_search/voice_search";

class HomeComponent extends Component{
  constructor(props){
    super(props);
  }
  
  render(){
    return(
      <div className="home-container">
        <Speech />
        <ArtistIndex />
        <AlbumIndex />
      </div>
    )
  }
}

export default HomeComponent;
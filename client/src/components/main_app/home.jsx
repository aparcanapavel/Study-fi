import React, { Component } from "react";
import ArtistIndex from "./artist/artist_index";
import AlbumIndex from "./album/album_index";

class HomeComponent extends Component{
  render(){
    return(
      <div className="home-container">
        <ArtistIndex />
        <AlbumIndex />
      </div>
    )
  }
}

export default HomeComponent;
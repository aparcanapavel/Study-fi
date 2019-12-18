import React, { Component } from "react";
import ArtistIndex from "./artist/artist_index";

class HomeComponent extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <div className="home-container">
        <ArtistIndex />
      </div>
    )
  }
}

export default HomeComponent;
import React from "react";
import { withRouter } from "react-router";
import FadeIn from "react-fade-in";

class PlaylistIndex extends React.Component{
  constructor(props){
    super(props);
    this.toPlaylist = this.toPlaylist.bind(this);
  }

  toPlaylist(playlistId){
    this.props.history.push(`/playlist/${playlistId}`);

    this.props.removeActive();
    const currentPlaylist = document.getElementById(`${playlistId}`);
    currentPlaylist.classList.add("active");
  }
  
  render() {
    console.log("playlist index", this.props.playlists);
    let playlists = this.props.playlists.map(playlist => {
      return (
        <li
          key={playlist._id}
          onClick={() => this.toPlaylist(playlist._id)}
          id={playlist._id}
          className="nav-name-item"
        >
          {playlist.name}
        </li>
      );
    });
    return (
      <ul className="playlist-index-container">
        {/* <FadeIn transitionDuration="300"> */}
          {playlists}
        {/* </FadeIn> */}
      </ul>
    );
  }
}

export default withRouter(PlaylistIndex);
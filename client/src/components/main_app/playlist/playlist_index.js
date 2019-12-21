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

    this.removeActive();
    const currentPlaylist = document.getElementById(`${playlistId}`);
    currentPlaylist.classList.add("active");
  }

  removeActive(){
    let playlistItems = document.getElementsByClassName("playlist-name-item");

    for (let i = 0; i < playlistItems.length; i++) {
      let playlist = playlistItems[i];
      playlist.classList.remove("active");
    }
  }
  
  render() {
    let playlists = this.props.playlists.map(playlist => {
      return (
        <li
          key={playlist._id}
          onClick={() => this.toPlaylist(playlist._id)}
          id={playlist._id}
          className="playlist-name-item"
        >
          {playlist.name}
        </li>
      );
    });
    return (
        <ul className="playlist-index-container">
          <FadeIn transitionDuration="300">{playlists}</FadeIn>
        </ul>
    );
  }
}

export default withRouter(PlaylistIndex);
import React from "react";
import LikedSongs from "./liked_songs";
import Playlists from "./playlists";

class Library extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="liked-container">
      <h1 className="liked-songs-header">Liked Songs</h1>
      <LikedSongs 
        currentUserId={this.props.currentUserId}
        userPlaylists={this.props.userPlaylists}
        currentSong={this.props.currentSong}
        playSongNow={this.props.playSongNow}
      />

      {/* <Playlists /> */}
    </div>
    )
  }
};

export default Library;
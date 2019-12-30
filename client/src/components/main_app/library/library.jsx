import React from "react";
import LikedSongs from "./liked_songs";
import Playlists from "./playlists";

class Library extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div>
      <LikedSongs 
        currentUserId={this.props.currentUserId}
        userPlaylists={this.props.userPlaylists}
        currentSong={this.props.currentSong}
        playSongNow={this.props.playSongNow}
      />

      <Playlists />
    </div>
    )
  }
};

export default Library;
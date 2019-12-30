import React from "react";
import LikedSongs from "./liked_songs";
import Playlists from "./playlists";

class Library extends React.Component {
  render() {
    return (
    <div>
      <LikedSongs />
      <Playlists />
    </div>
    )
  }
};

export default Library;
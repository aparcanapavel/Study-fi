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
      />

      <Playlists />
    </div>
    )
  }
};

export default Library;
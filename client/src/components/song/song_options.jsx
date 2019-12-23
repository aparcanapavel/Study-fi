import React from "react";

class SongOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { section: this.props.section }
  }


  render() {
    return (
      <section className={this.state.section}>
        <button className="song-options-button">
          Add To Playlist
          {/* <AddToPlaylist currentUserId={this.props.currentUserId} songId={this.props.songId} /> */}
        </button>
      </section>
    )
  }

}

export default SongOptions;
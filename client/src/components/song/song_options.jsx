import React from "react";
import AddToPlaylist from "./add_to_playlist";

class SongOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state = { section: this.props.section, addToPlaylist: false };
    this.toggleAddToPlaylist = this.toggleAddToPlaylist.bind(this);
  }

  toggleAddToPlaylist(e){
    e.stopPropagation()
    this.setState({addToPlaylist: !this.state.addToPlaylist })
  }

  render() {
    return (
      <section className={this.state.section}>
        <button onClick={(e) => this.toggleAddToPlaylist(e)} className="song-options-button">
          Add To Playlist
          
        </button>
        {this.state.addToPlaylist &&
          <AddToPlaylist 
            songId={this.props.songId} 
            userPlaylists={this.props.userPlaylists} 
            currentUserId={this.props.currentUserId}
            toggleAddToPlaylist={this.toggleAddToPlaylist}
            toggleSongOptions={this.props.toggleSongOptions}
          />
        }
      </section>
    )
  }

}

export default SongOptions;
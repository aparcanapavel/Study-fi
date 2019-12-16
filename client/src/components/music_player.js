import React from 'react';

class MusicPlayer extends React.Component {

  render() {
    return (
      <div className="music-player-container">
        <audio className="music-player" src="https://study-fi-public.s3.amazonaws.com/01+'90.m4a" controls>

        </audio>
      </div>
    )
  }
}

export default MusicPlayer;
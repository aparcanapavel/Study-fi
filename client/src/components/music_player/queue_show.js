import React from 'react';
import { withRouter } from "react-router";

class QueueShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      noQueue: false
    }
    this.parseTime = this.parseTime.bind(this);
    this.paresArtists = this.paresArtists.bind(this);
  }

  parseTime(int) {
    let minutes = Math.floor(int / 60);
    let seconds = int % 60 < 10 ? `0${int % 60}` : int % 60;
    return `${minutes}:${seconds}`;
  }

  setQueue(data){
    if(data){
      this.setState({ data });
    } else {
      this.setState({ noQueue: true })
    }
  }

  componentDidMount() {
    if (!this.props.location.state) {
      this.props.history.push("/");
    } else {
      this.props.onRef(this);
      this.props.getQueue();
    }
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  paresArtists(song) {
    let artists = "";
    if (song.artists.length > 2) {
      artists = "Various Artists";
    } else {
      song.artists.forEach((artist, i) => {
        if (i === 0) {
          artists += artist.name;
        } else {
          artists += ", " + artist.name;
        }
      });
    }

    return artists;
  }

  render() {
    if (!this.state.data) {
      return <p>loading...</p>;
    }
    if(this.noQueue){
      return (
        <h3 className="no-queue">Play an Album or playlist to take a look at your queue!</h3>
      )
    }
    
    const { queue, history, currentSongIdx, isPlaying, currentlyPlaying } = this.state.data;
    // console.log("queue", queue);
    // console.log("history", history);
    // console.log("currentSongIdx", currentSongIdx);
    // console.log("isPlaying", isPlaying);
    // console.log("currentlyPlaying", currentlyPlaying);
    const currentSong = currentlyPlaying || queue[currentSongIdx];

    let currentSongArtists = this.paresArtists(currentSong);
    
    const historyIds = [];
    history.forEach(song => {
      historyIds.push(song._id);
    })  
  
    const queueSongs = queue.map(song => {
      if (song._id !== currentSong._id && !historyIds.includes(song._id)) {
          return (
              <li className="queue-song-item" key={song._id}>
                <p className="queue-song-name">{song.name}</p>
                <p className="queue-song-artist">{this.paresArtists(song)}</p>
                <p>{this.parseTime(song.duration)}</p>
              </li>
            );
          }
        });

    return (
      <section className="queue-container">
        <h2 className="queue-page-title">Play Queue</h2>

        <div className="queue-section">
          <h3>Now Playing</h3>
          <div className="queue-headers">
            <p>TITLE</p>
            <p>ARTISTS</p>
            <p>LENGTH</p>
          </div>
          <div className="curent-song-playing">
            <p>{currentSong.name}</p>
            <p>{currentSongArtists}</p>
            <p>{this.parseTime(currentSong.duration)}</p>
          </div>
        </div>

        <div className="queue-section">
          <h3>Next Up</h3>
          <div className="queue-headers">
            <p>TITLE</p>
            <p>ARTISTS</p>
            <p>LENGTH</p>
          </div>
          <ul className="next-up-queue">{queueSongs}</ul>
        </div>
      </section>
    );
  }
}

export default withRouter(QueueShow);
import React from 'react';
import Queries from "../graphql/queries";
import { Query } from 'react-apollo';
const { FETCH_SONGS } = Queries;

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      history: [],
      currentSongIdx: 0,
      isPlaying: false
    };
    this.addToQueue = this.addToQueue.bind(this);
    this.populateQueue = this.populateQueue.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.previous = this.previous.bind(this);
    this.playpause = this.playpause.bind(this);
  }

  populateQueue(songs) {
    const currentQueue = Object.values(this.state.queue);
    const songsObj = {};
    
    for(let i = currentQueue.length; i < 10; i++){
      let song =
        songs[
          Math.floor(Math.random() * Math.floor(Object.keys(songs).length))
        ];
      if(!Object.keys(songsObj).includes(song._id)){
        songsObj[song._id] = song;
      }
    }
    Object.assign(this.state, { queue: Object.values(songsObj)});
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
    clearTimeout(this.timeout);
  }

  previous(){
    let songIdx = this.state.currentSongIdx;
    if(songIdx <= 0){
      songIdx = 0;
    } else {
      songIdx--;
    }
    this.timeout = setTimeout(() => {
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({ currentSongIdx: songIdx, isPlaying: true });
  }

  playpause(){
    const player = document.getElementById("music-player");
    if (this.state.isPlaying) {
      player.pause();
      this.setState({ isPlaying: false });
    } else {
      player.play();
      this.setState({ isPlaying: true });
    }
  }

  nextSong(){
    const currentSong = this.state.queue[0];
    const currentHist = this.state.history;
    const currentQueue = this.state.queue;
    let songIdx = this.state.currentSongIdx + 1;
    currentHist.push(currentSong);

    this.timeout = setTimeout(() => {
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({
      queue: currentQueue,
      history: currentHist,
      currentSongIdx: songIdx,
      isPlaying: true
    });
  }

  playSongNow(song){
    const newQueue = [song].concat(this.state.queue);
    this.timeout = setTimeout(() => {
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({ queue: newQueue, currentSongIdx: 0, isPlaying: true }, this.props.setCurrentSong(song));
  }

  playAlbumNow(albumSongs){
    const newQueue = Object.values(albumSongs);
    this.timeout = setTimeout(() => {
      const song = this.state.queue[this.state.currentSongIdx];
      this.props.setCurrentSong(song);
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({ queue: newQueue, currentSongIdx: 0, isPlaying: true });
  }

  addToQueue(song) {
    console.log("old queue: " + this.state.queue);
    const newQueue = this.state.queue;
    // newQueue.push(song);
    Object.assign(this.state, (newQueue[song._id] = song));
    // this.setState({ queue: newQueue });
    console.log("-------------------------------");
    console.log("new Queue: " + this.state.queue);
  }

  render() {
    
    return (
      <div className="music-player-container">
        <Query query={FETCH_SONGS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            if(this.state.queue.length === 0){
              this.populateQueue(data.songs);
            }

            const songs = this.state.queue;

            let song = songs[this.state.currentSongIdx];
            console.log("music-player: ", song);
            let artists = "";
            song.artists.map((artist, i) => {
              if(i === 0){
                artists += artist.name;
              } else {
                artists += ", " + artist.name;
              }
            })
            return (
              <div className="controlls">
                <div className="left-controlls">
                  <img className="player-album-cover" />
                  <div className="player-song-details">
                    <p>{song.name}</p>
                    <p>{artists}</p>
                  </div>
                </div>
                <div className="mind-controlls">
                  <i className="fas fa-step-backward" onClick={this.previous}></i>
                  <i className="far fa-play-circle" onClick={this.playpause}></i>
                  <i className="fas fa-step-forward" onClick={this.nextSong}></i>
                  <audio
                    id="music-player"
                    className="music-player-container"
                    onEnded={this.nextSong}
                    src={song.songUrl}
                  ></audio>
                </div>
                <div className="right-controlls"></div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default MusicPlayer;
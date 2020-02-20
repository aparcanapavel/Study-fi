import React from 'react';
import { Link } from 'react-router-dom';
import Queries from "../graphql/queries";
import { Query } from 'react-apollo';
import ProgressFiller from "./music_player/progress_filler";
import VolumeFiller from "./music_player/volume_filler";
const { FETCH_SONGS } = Queries;

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: [],
      history: [],
      currentSongIdx: 0,
      isPlaying: false,
      songPercentage: 101,
      volShift: 0,
      isMuted: false
    };
    this.addToQueue = this.addToQueue.bind(this);
    this.populateQueue = this.populateQueue.bind(this);
    this.nextSong = this.nextSong.bind(this);
    this.previous = this.previous.bind(this);
    this.playpause = this.playpause.bind(this);
    this.updateProgressBar = this.updateProgressBar.bind(this);
    this.convertElapsedTime = this.convertElapsedTime.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.toggleButtonAnimation = this.toggleButtonAnimation.bind(this);
    this.handleVol = this.handleVol.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.getQueue = this.getQueue.bind(this);
    this.playAlbumSongNow = this.playAlbumSongNow.bind(this);
  }

  getQueue() {
    if (this.state.queue.length <= 0) return null;
    return this.state;
  }

  toggleMute() {
    const isMuted = this.state.isMuted;
    if (isMuted) {
      this.setState({ isMuted: !isMuted, volShift: 0 });
    } else {
      this.setState({ isMuted: !isMuted, volShift: 100 });
    }
  }

  populateQueue(songs) {
    const currentQueue = Object.values(this.state.queue);
    const songsObj = {};

    for (let i = currentQueue.length; i < 10; i++) {
      let song =
        songs[
          Math.floor(Math.random() * Math.floor(Object.keys(songs).length))
        ];
      if (!Object.keys(songsObj).includes(song._id)) {
        songsObj[song._id] = song;
      }
    }
    Object.assign(this.state, { queue: Object.values(songsObj) });
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
    clearTimeout(this.timeout);
    clearTimeout(this.timer);
    clearTimeout(this.timer2);
  }

  updateProgressBar(e) {
    const audioEl = document.getElementById("music-player");
    let currentTime = audioEl.currentTime;
    let duration = audioEl.duration;
    document.getElementById(
      "song-current-time"
    ).innerHTML = this.convertElapsedTime(currentTime);
    const songPercentage = (currentTime / duration) * 100;
    let reversePercent = 100 - songPercentage;

    this.setState({ songPercentage: reversePercent });
  }

  convertElapsedTime(inputSeconds) {
    let seconds = Math.floor(inputSeconds % 60);
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    const minutes = Math.floor(inputSeconds / 60);
    return minutes + ":" + seconds;
  }

  handleSeek(e) {
    const OSL = this.getOffsetLeft(e.target);
    const clickedPos = e.clientX - OSL;
    const audioEl = document.getElementById("music-player");

    audioEl.currentTime =
      (clickedPos / e.target.offsetWidth) * audioEl.duration;
  }

  handleVol(e) {
    const OSL = this.getOffsetLeft(e.target);
    const clickedPos = e.clientX - OSL;
    let volShift = (clickedPos / e.target.offsetWidth) * 100;

    volShift = 100 - volShift;

    const audioEl = document.getElementById("music-player");
    audioEl.volume = clickedPos / e.target.offsetWidth;
    this.setState({ volShift });
  }

  getOffsetLeft(elem) {
    let offsetLeft = 0;
    do {
      if (!isNaN(elem.offsetLeft)) {
        offsetLeft += elem.offsetLeft;
      }
    } while ((elem = elem.offsetParent));
    return offsetLeft;
  }

  previous() {
    let songIdx = this.state.currentSongIdx;
    if (songIdx <= 0) {
      songIdx = 0;
    } else {
      songIdx--;
    }
    this.timeout = setTimeout(() => {
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState(
      { currentSongIdx: songIdx, isPlaying: true, songPercentage: 101 },
      this.props.setCurrentSong(this.state.queue[songIdx])
    );
  }

  playpause() {
    const player = document.getElementById("music-player");
    if (this.state.isPlaying) {
      player.pause();
      this.timer = setTimeout(() => {
        this.setState({ isPlaying: false });
      }, 200);
      this.toggleButtonAnimation();
    } else {
      player.play();
      this.timer = setTimeout(() => {
        this.setState({ isPlaying: true });
      }, 200);
      this.toggleButtonAnimation();
    }
  }

  toggleButtonAnimation() {
    const player = document.getElementById("play-pause");
    this.timer2 = setTimeout(() => {
      player.classList.remove("button-down");
    }, 100);
    player.classList.add("button-down");
  }

  nextSong() {
    const currentSong = this.state.queue[this.state.currentSongIdx];
    const currentHist = this.state.history;
    const currentQueue = this.state.queue;
    let songIdx = this.state.currentSongIdx + 1;
    const player = document.getElementById("music-player");
    if (songIdx === this.state.queue.length) {
      player.pause();
      player.currentTime = 0;
      return this.setState({ songPercentage: 101, isPlaying: false });
    }
    currentHist.push(currentSong);

    this.timeout = setTimeout(() => {
      player.play();
    }, 1);
    this.setState(
      {
        queue: currentQueue,
        history: currentHist,
        currentSongIdx: songIdx,
        isPlaying: true,
        songPercentage: 101
      },
      this.props.setCurrentSong(this.state.queue[songIdx])
    );
  }

  playSongNow(song) {
    const newQueue = [song].concat(this.state.queue);
    this.timeout = setTimeout(() => {
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState(
      { queue: newQueue, currentSongIdx: 0, isPlaying: true },
      this.props.setCurrentSong(song)
    );
  }

  playAlbumNow(albumSongs) {
    const newQueue = Object.values(albumSongs);
    this.timeout = setTimeout(() => {
      const song = this.state.queue[this.state.currentSongIdx];
      this.props.setCurrentSong(song);
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({ queue: newQueue, currentSongIdx: 0, isPlaying: true });
  }

  playAlbumSongNow(albumSongs, songIdx) {
    const newQueue = Object.values(albumSongs);
    this.timeout = setTimeout(() => {
      const song = this.state.queue[this.state.currentSongIdx];
      this.props.setCurrentSong(song);
      const player = document.getElementById("music-player");
      player.play();
    }, 1);
    this.setState({
      history: [],
      queue: newQueue,
      currentSongIdx: songIdx,
      isPlaying: true
    });
  }

  addToQueue(song) {
    // console.log("old queue: " + this.state.queue);
    const newQueue = this.state.queue;
    // newQueue.push(song);
    Object.assign(this.state, (newQueue[song._id] = song));
    // this.setState({ queue: newQueue });
    // console.log("-------------------------------");
    // console.log("new Queue: " + this.state.queue);
  }

  render() {
    return (
      <div className="music-player-container">
        <Query query={FETCH_SONGS}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error</p>;

            if (this.state.queue.length === 0) {
              this.populateQueue(data.songs);
            }

            const songs = this.state.queue;

            let song = songs[this.state.currentSongIdx];

            let artists = "";
            song.artists.map((artist, i) => {
              if (i === 0) {
                artists += artist.name;
              } else {
                artists += ", " + artist.name;
              }
              return artists;
            });
            return (
              <div className="controlls">
                <div className="left-controlls">
                  <img
                    className="player-album-cover"
                    alt=""
                    src={song.album.imageUrl}
                  />
                  <div className="player-song-details">
                    <p>{song.name}</p>
                    <p>{artists}</p>
                  </div>
                </div>
                <div className="mid-controlls">
                  <div className="main-controlls">
                    <i
                      className="fas fa-step-backward"
                      onClick={this.previous}
                    ></i>
                    <i
                      id="play-pause"
                      className={
                        this.state.isPlaying
                          ? "far fa-pause-circle"
                          : "far fa-play-circle"
                      }
                      onClick={this.playpause}
                    ></i>
                    <i
                      className="fas fa-step-forward"
                      onClick={this.nextSong}
                    ></i>
                  </div>

                  <div className="progress-bar">
                    <p id="song-current-time"></p>
                    <div
                      className="progress-bar-shell"
                      onMouseDown={this.handleSeek}
                    >
                      <ProgressFiller
                        songPercentage={this.state.songPercentage}
                      />
                    </div>
                    <p id="song-duration"></p>
                  </div>
                  <audio
                    id="music-player"
                    className="music-player-container"
                    onEnded={this.nextSong}
                    src={song.songUrl}
                    onTimeUpdate={this.updateProgressBar}
                    onLoadedMetadata={e => {
                      const audioEl = document.getElementById("music-player");
                      let currentTime = audioEl.currentTime;
                      let duration = audioEl.duration;
                      document.getElementById(
                        "song-current-time"
                      ).innerHTML = this.convertElapsedTime(currentTime);

                      document.getElementById(
                        "song-duration"
                      ).innerHTML = this.convertElapsedTime(duration);
                    }}
                    muted={this.state.isMuted}
                  ></audio>
                </div>
                <div className="right-controlls">
                  <Link
                    to={{
                      pathname: "/queue",
                      state: {
                        isPlaying: this.state.isPlaying
                      }
                    }}
                    className="material-icons"
                  >
                    queue_music
                  </Link>

                  <i
                    className={
                      this.state.isMuted
                        ? "fas fa-volume-mute"
                        : "fas fa-volume-up"
                    }
                    onClick={this.toggleMute}
                  ></i>
                  <div
                    className="volume-seeker-shell"
                    onMouseDown={this.handleVol}
                  >
                    <VolumeFiller volShift={this.state.volShift} />
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default MusicPlayer;
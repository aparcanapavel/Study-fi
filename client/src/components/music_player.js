import React from 'react';
import Queries from "../graphql/queries";
import { Query } from 'react-apollo';
const { FETCH_SONGS } = Queries;

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: {}
    };
    this.addToQueue = this.addToQueue.bind(this);
    this.populateQueue = this.populateQueue.bind(this);
    this.nextSong = this.nextSong.bind(this);
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
    Object.assign(this.state, { queue: songsObj});
    // this.setState({ queue: songsObj });
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  nextSong(){
    console.log("play next song");
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
        <audio className="music-player" controls onEnded={this.nextSong}>
          <Query query={FETCH_SONGS}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error</p>;

              this.populateQueue(data.songs);

              const songs = Object.values(this.state.queue)
              // .map(song => {
              //   return <source key={song._id} src={song.songUrl}/>
              // })
              let song = songs.shift();
              console.log(song);
              return <source key={song._id} src={song.songUrl} />;
            }}
          </Query>
        </audio>
      </div>
    );
  }
}

export default MusicPlayer;
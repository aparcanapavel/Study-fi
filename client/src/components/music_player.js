import React from 'react';

class MusicPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: []
    };
    this.addToQueue = this.addToQueue.bind(this);
  }

  populateQueue() {
    //queries for all songs and populates the queue for up to 10 songs at a time.
  }

  componentDidMount() {
    this.props.onRef(this);
  }
  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  addToQueue(song) {
    console.log("old queue: " + this.state.queue);
    const newQueue = this.state.queue;
    newQueue.push(song);
    this.setState({ queue: newQueue });
    console.log("-------------------------------");
    console.log("new Queue: " + this.state.queue);
  }

  render() {
    return (
      <div className="music-player-container">
        <audio className="music-player" src="" controls></audio>
      </div>
    );
  }
}

export default MusicPlayer;
import React from "react";
import SpeechRecognition from "react-speech-recognition";
import PropTypes from "prop-types";

const propTypes = {
  transcript: PropTypes.string,
  resetTranscript: PropTypes.func,
  browserSupportsSpeechRecognition: PropTypes.bool,
  audioStart: PropTypes.bool
};

const options = {
  autoStart: false,
};

// const SpeechRecognitionComponent = ({
//   transcript,
//   resetTranscript,
//   browserSupportsSpeechRecognition,
//   startListening,
//   stopListening,
//   abortListening,
//   listening
// }) => {
//   if (!browserSupportsSpeechRecognition) {
//     return null;
//   }
  

//   return (
//     <div>
//       <button className="voice-reset-button" onClick={resetTranscript}>Reset</button>
//       <button className="voice-start-button" onClick={startListening}>Start</button>
//       <button className="voice-stop-button" onClick={stopListening}>Stop</button>
//       <button className="voice-abort-button" onClick={abortListening}>Abort</button>
//       <br/>
//       <input type="text" value={transcript}></input>
//     </div>
//   );
// };

class SpeechRecognitionComponent extends React.Component{
  constructor(props) {
    super(props);
    this.state = {listening: false, transcript: this.props.transcript};
    this.handleVoice = this.handleVoice.bind(this);
  }

  componentDidUpdate() {
    if (this.state.transcript !== this.props.transcript ) {
      this.props.voiceUpdateSearch(this.props.data, this.props.transcript)
      this.setState({transcript: this.props.transcript});
    }
  }

  handleVoice() {
    if (this.state.listening) {
      this.props.stopListening();
      this.setState({listening: false});
    } else {
      this.props.startListening();
      this.setState({listening: true});
    }
  }

  update(e) {
    this.setState({transcript: this.props.transcript})
    console.log(this.props.transcript);
  }

  render(){
    if (!this.props.browserSupportsSpeechRecognition) {
      return null;
    }
    return (
      <div>
        <br/>
        <br/>
        <button className="voice-reset-button" onClick={this.props.resetTranscript}>X</button>
        {/* <button className="voice-start-button" onClick={this.props.startListening}>Start</button>
        <button className="voice-stop-button" onClick={this.props.stopListening}>Stop</button>
        <button className="voice-abort-button" onClick={this.props.abortListening}>Abort</button> */}
        <button onClick={this.handleVoice}>Microphone</button>
        <br/>
        <input value={this.props.transcript}></input>
      </div>
    );
};
}

SpeechRecognitionComponent.propTypes = propTypes;

export default SpeechRecognition(options)(SpeechRecognitionComponent);
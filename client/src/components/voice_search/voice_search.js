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
    this.state = {
      listening: false, 
      transcript: this.props.transcript
    };
    this.handleVoice = this.handleVoice.bind(this);
  }

  componentDidUpdate(a, b) {
    if (this.state.listening) {
      if (this.state.transcript !== this.props.transcript) {
        this.setState(
          { transcript: this.props.transcript },
          this.props.voiceUpdateSearch(this.props.data, this.props.transcript)
        );
      }
    }
  }

  componentWillUnmount() {
    this.handleVoice();
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

  render(){
    if (!this.props.browserSupportsSpeechRecognition) {
      return null;
    }
    return (
      <div className="voice-search">
        <input 
          className="voice-search-transcript"
          value={this.props.transcript}
          placeholder="Search for Artists, Songs, or Albums"
        />

        <button 
          className="voice-reset-button" 
          onClick={this.props.resetTranscript}
        >
          X
        </button>
        {/* <button className="voice-start-button" onClick={this.props.startListening}>Start</button>
        <button className="voice-stop-button" onClick={this.props.stopListening}>Stop</button>
        <button className="voice-abort-button" onClick={this.props.abortListening}>Abort</button> */}
        <button 
          onClick={this.handleVoice}
          className="voice-listen-button"
        >
            Microphone
        </button>
      </div>
    );
};
}

SpeechRecognitionComponent.propTypes = propTypes;

export default SpeechRecognition(options)(SpeechRecognitionComponent);
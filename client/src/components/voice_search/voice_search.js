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

const SpeechRecognitionComponent = ({
  transcript,
  resetTranscript,
  browserSupportsSpeechRecognition,
  startListening,
  stopListening,
  abortListening,
  listening
}) => {
  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div>
      <button className="voice-reset-button" onClick={resetTranscript}>Reset</button>
      <button className="voice-start-button" onClick={startListening}>Start</button>
      <button className="voice-stop-button" onClick={stopListening}>Stop</button>
      <button className="voice-abort-button" onClick={abortListening}>Abort</button>
      <br/>
      <span>{transcript}</span>
    </div>
  );
};

SpeechRecognitionComponent.propTypes = propTypes;

export default SpeechRecognition(options)(SpeechRecognitionComponent);
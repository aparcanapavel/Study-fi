import React from "react";

class ProgressFiller extends React.Component{
  render() {
    return (
      <div
        className="progress-bar-filler"
        style={{ transform: `translateX(-${this.props.songPercentage}%)` }}
      ></div>
    );
  }
}

export default ProgressFiller;
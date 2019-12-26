import React from "react";

class ProgressFiller extends React.Component{
  constructor(props){
    super(props);
  }

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
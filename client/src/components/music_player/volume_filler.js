import React from "react";

class VolumeFiller extends React.Component {
  render() {
    return (
      <div
        className="vol-filler"
        style={{ transform: `translateX(-${this.props.volShift}%)` }}
      ></div>
    );
  }
}

export default VolumeFiller;

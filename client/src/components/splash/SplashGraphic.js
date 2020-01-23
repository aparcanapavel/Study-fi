import React from "react";
import { Link } from 'react-router-dom'

class SplashGraphic extends React.Component {

  render() {
    return (
      <div className="splash-graphic">
        <h1 className="splash-graphic-header">Welcome to Studyfi <i className="fas fa-graduation-cap"></i></h1>
        <p className="splash-graphic-p">Register or Login to enjoy our library of Lo-Fi hip-hop songs</p>
        <Link to="/learn-more">Learn More</Link>
      </div>
    )
  }
}

export default SplashGraphic;
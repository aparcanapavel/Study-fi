import React from "react";
import Login from "./Login";
import Register from "./Register";
import { Switch, Route } from "react-router-dom";
import SplashGraphic from "./SplashGraphic";
import AuthRoute from "../../util/route_util";
import LearnMore from './LearnMore';

class Splash extends React.Component {

  render() {
    return (
      <div className="splash-container">
        <Switch>
          <Route exact path="/" component={ SplashGraphic }/>
          <AuthRoute exact path="/login" component={ Login } routeType="auth" />
          <AuthRoute exact path="/register" component={ Register } routeType="auth" />
          <Route path="/learn-more" component={LearnMore} />
        </Switch>
      </div>
    )
  }
}

export default Splash;
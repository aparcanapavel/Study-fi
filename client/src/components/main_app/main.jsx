import React, { Component } from "react";
import Nav from "../Nav";

class MainComponent extends Component {
  constructor(props){
    super(props);
  }

  render(){
    return (
      <main className="overall-container">
        <nav className="top-nav">
          <Nav />
        </nav>
        <aside className="main-nav">
          <h2>
            <i class="fas fa-graduation-cap"></i> Study-fi
          </h2>
          <div className="main-links">
            <h3 key="1">
              <i class="fas fa-university"></i> Home
            </h3>
            <h3 key="2">
              <i class="fas fa-search"></i> Search
            </h3>
            <h3 key="3">
              <i class="fas fa-book"></i> Your Library
            </h3>
          </div>
        </aside>
        <section className="main-container">
          all the music boxes
        </section>
      </main>
    );
  }
}

export default MainComponent;
import React from "react";

class LearnMore extends React.Component {
  // constructor(props){
  //   super(props);
  // }

  render() {
    return (
      <section id="learn-more-container">
        <h3>Learn More</h3>
        <div className="learn-more-paragraph">
          <p>
            As a team, we decided to create a platform for people that just want
            to open the app, click play and begin working. Study-fi aims to be a
            clone of Spotify with a minimalistic twist in order to allow for
            less distrations and a more focus environment. Working on Study-fi
            took us about two weeks of work. To view our source code, click 
            <a
              href="https://github.com/aparcanapavel/Study-fi"
              target="_blank"
              rel="noopener noreferrer"
            >
               here
            </a>
          </p>
        </div>
      </section>
    );
  }
}

export default LearnMore;
import React, { Component } from "react";
import "./header.css";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <h3 style={{ paddingTop: "5px" }}>
          Welcome to <strong>ScoreTrackr</strong>
        </h3>
      </header>
    );
  }
}

export default Header;

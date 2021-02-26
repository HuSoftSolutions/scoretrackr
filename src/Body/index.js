import React, { Component } from "react";
import MatchComponent from "../Match";
import "./index.css";

class Body extends Component {
  render() {
    return (
      <div className="body">
        <MatchComponent />
      </div>
    );
  }
}

export default Body;

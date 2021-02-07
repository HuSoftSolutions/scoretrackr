import "./App.css";
import { Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Body from "./Body/index";
import Footer from "./Footer/index";

function App() {
  return (
    <div className="page-container">
      <header className="header">
        Welcome to <strong>ScoreTrackr</strong>
      </header>
      <Body />
      <Footer />
    </div>
  );
}

export default App;

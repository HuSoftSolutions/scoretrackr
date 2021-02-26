import "./App.css";
import { Button } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Body from "./Body/index";
import Footer from "./Footer/index";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="page-container">
      <header className="header">
        <h3>Welcome to <strong>ScoreTrackr</strong></h3>
      </header>
      <Body />
      <Footer />
    </div>
  );
}

export default App;

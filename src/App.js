import "./App.css";
import React, { useState, useEffect } from "react";
import Body from "./Layout/Body/index";
import Footer from "./Layout/Footer/index";
import Header from "./Layout/Header/index";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <div className="page_container">
      <div className="header_container">
        <Header />
      </div>
      <div className="body_container">
        <Body />
      </div>
      <div className="footer_container">
        <Footer />
      </div>
    </div>
  );
}

export default App;

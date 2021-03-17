import "./App.css";
import React, { useState, useEffect } from "react";
import Body from "./Layout/Body/index";
import Footer from "./Layout/Footer/index";
import Header from './Layout/Header/index';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="page-container">
      <Header/>
      <Body />
      <Footer />
    </div>
  );
}

export default App;

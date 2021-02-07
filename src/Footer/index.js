import React, { Component } from "react";
import "./index.css";

class Footer extends Component {
  render() {
    return (
      <div className="main-footer">
        <div className="container">
          <br />
          <br />
          <br />
          <strong>Copyright © 2021 ScoreTrackr | HuSoft Solutions, LLC.</strong>
          <p className="mb-0">All Rights Reserved.</p>
          {/* <a href="mailto:info@teefinder.com" className="mb-0">
                cody.husek@husoftsolutions.com
              </a> */}
          <br />
        </div>
      </div>
    );
  }
}

export default Footer;

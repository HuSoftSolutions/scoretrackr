import React, { Component, useState } from "react";
import { Button } from "react-bootstrap";
import ScoreTracker from "../../Components/ScoreTracker/scoreTracker";
import "./index.css";

const Body = () => {
  const [createNewScorecard, setCreateScorecard] = useState(false);

  return createNewScorecard === false ? (
    <div className="createScorecardButtonDiv">
      <Button
        className="createScorecardButton"
        variant="info"
        size="lg"
        type="button"
        onClick={() => setCreateScorecard(true)}
      >
        CREATE SCORECARD
      </Button>
    </div>
  ) : (
    <ScoreTracker />
  );
};

export default Body;

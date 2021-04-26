import React, { Component, useState } from "react";
import { Button } from "react-bootstrap";
import ScoreTracker from "../../Components/ScoreTracker/scoreTracker";
import "./index.css";
import { useStore } from "./../../store";


const Body = () => {
  const { state, dispatch } = useStore();


  return state.createNewScorecard === false ? (
    <div className="alignCenter">
      <Button
        className="createScorecardButton alignCenter"
        variant="info"
        size="lg"
        type="button"
        onClick={() =>  {
          dispatch({
            type: "create-new-scorecard",
            createNewScorecard: true,
          });
          }}
      >
        CREATE SCORECARD
      </Button>
    </div>
  ) : (
    <ScoreTracker />
  );
};

export default Body;

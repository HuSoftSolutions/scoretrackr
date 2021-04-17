import React, { useState, useEffect } from "react";
import "./holetracker.css";
import PlayerScoreComponent from "../Player/index";
import { useStore } from "./../../store";

export default function HoleTracker(props) {
  const { state, dispatch } = useStore();

  const updateScore = (playerName, score, hole) => {
    props.updateScorecard(playerName, score, hole);
  };

  return (
    <React.Fragment>
      <div className="review_edit_finish_Div">
        <h6 className="review_edit_finish" onClick={props.scorecardReview}>
          Review Scorecard
        </h6>
        <h6 className="review_edit_finish" onClick={props.editActivePlayers}>
          Edit Players
        </h6>
        <h6 className="review_edit_finish" onClick={props.endRound}>
          Finish Incomplete Round
        </h6>
      </div>

      {props.roundLength.map((hole) => (
        <div
          className={
            props.activeIndex === hole
              ? "holeTracker_conditionalDisplay"
              : "noDisplay"
          }
          key={hole}
        >
          <div className="currentHole_Div">
            <h4 className="holeStyle">HOLE</h4>
            <h1>{hole}</h1>
          </div>
          <div>
            {state.activePlayers.map((player, index) => {
              return (
                <PlayerScoreComponent
                  name={player}
                  key={index}
                  hole={hole}
                  scorecard={state.activeScorecard}
                  setScore={(playerName, score) => {
                    updateScore(playerName, score, hole);
                  }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </React.Fragment>
  );
}

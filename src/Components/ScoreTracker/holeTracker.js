import React, { useState, useEffect } from "react";
import PlayerScoreComponent from "../Player/index";
import { useStore } from "./../../store";
import "./holetracker.css";

export default function HoleTracker(props) {
  const { state, dispatch } = useStore();

  const updateScore = (playerIndex, score, hole) => {
    let updatedScorecard = state.activeScorecard;

    updatedScorecard[playerIndex].holes[hole] = score;
    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });
  };

  const checkPressAbility = (playerIndex, hole) => {
    let ableToPress = true;
    const currentPlayerScore = state.activeScorecard[playerIndex].holes[hole];

    state.activeScorecard.map((player, index) => {
      if (playerIndex !== index) {
        if (player.holes[hole] && currentPlayerScore) {
          if (player.holes[hole] >= currentPlayerScore) {
            ableToPress = false;
          }
        }
        else ableToPress = false;
      }
    });
    return ableToPress;
  };

  return (
    <React.Fragment>
      <div className="review_edit_Div">
        <h6 className="review_edit" onClick={props.scorecardReview}>
          Review Scorecard
        </h6>
        <h6 className="review_edit" onClick={props.editActivePlayers}>
          Edit Players
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
          <div className="playerScore_Div">
            {state.activeScorecard.map((player, index) => {
              return (
                <PlayerScoreComponent
                  name={player.name}
                  key={index}
                  index={index}
                  hole={hole}
                  ableToPress={checkPressAbility(index, hole)}
                  setScore={(playerIndex, score) => {
                    updateScore(playerIndex, score, hole);
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

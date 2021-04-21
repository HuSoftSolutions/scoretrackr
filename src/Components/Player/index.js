import React, { useState, useEffect } from "react";
import "./index.css";
import PlusIcon from "../../Icons_Images/plusIcon";
import MinusIcon from "../../Icons_Images/minusIcon";
import { useStore } from "./../../store";


export default function PlayerScore(props) {
  const [score, setScore] = useState(0);
  const { state, dispatch } = useStore();


  const decrementScore = () => {
    if (score > 0) {
      updateScore("decrement");
    }
  };

  const updateScore = (change) => {
    let newScore = change === "increment" ? score + 1 : score - 1;
    setScore(newScore);
    props.setScore(props.index, newScore);
  };

  useEffect(function () {
    if (state.activeScorecard[props.index].holes[props.hole])
      setScore(state.activeScorecard[props.index].holes[props.hole]);
  });

  return (
    <div className="plContainer">
      <p className="plName">{props.name}</p>
      <div className="scoreIncrementDiv">
        <div onClick={decrementScore}>{MinusIcon("scoreButton")}</div>
        <p className="playerScore">{score > 0 ? score : "-"}</p>
        <div onClick={() => updateScore("increment")}>
          {PlusIcon("scoreButton")}
        </div>
      </div>
    </div>
  );
}

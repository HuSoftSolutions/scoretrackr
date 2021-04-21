import React, { useState, useEffect } from "react";
import ReviewViewPlayerTable from "./roundTable";
import PlayerIcon from "../../Icons_Images/playerIcon";
import { useStore } from "./../../store";


export default function ReviewView(props) {
  const { state, dispatch } = useStore();

  return (
    <div className="reviewView_Div">
      <div
        style={{ alignSelf: "flex-end", marginRight: "20px" }}
        onClick={() => props.closeReviewView()}
      >
        Go back
      </div>
      {state.activeScorecard.map((player, index) => {
        return (
          <div className="reviewView_PlayerDiv" key={index}>
            <div style={{ display: "flex" }}>
              {PlayerIcon("", 20)}{" "}
              <h4 style={{ paddingLeft: "10px" }}>{player.name}</h4>
            </div>
            <div className="reviewView_TableDiv">
              <ReviewViewPlayerTable
                player={player}
                scorecardInfo={props.roundData}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

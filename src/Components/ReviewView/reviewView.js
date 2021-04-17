import React, { useState, useEffect } from "react";
import ReviewViewPlayerTable from "./roundTable";
import PlayerIcon from "../../Icons_Images/playerIcon";

export default function ReviewView(props) {
  return (
    <div className="reviewView_Div">
      <div
        style={{ alignSelf: "flex-end", marginRight: "20px" }}
        onClick={() => props.closeReviewView()}
      >
        Go back
      </div>
      {props.roundData.players.map((playerName, index) => {
        return (
          <div className="reviewView_PlayerDiv" key={index}>
            <div style={{ display: "flex" }}>
              {PlayerIcon("", 20)}{" "}
              <h4 style={{ paddingLeft: "10px" }}>{playerName}</h4>
            </div>
            <div className="reviewView_TableDiv">
              <ReviewViewPlayerTable
                player={playerName}
                scorecardInfo={props.roundData}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

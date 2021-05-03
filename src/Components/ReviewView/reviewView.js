import React, { useState, useEffect } from "react";
import ReviewViewPlayerTable from "./roundTable";
import PlayerIcon from "../../Icons_Images/playerIcon";
import InteractiveModal from "../Modals_Alerts/interactiveModal";
import Leaderboard from "./leaderboard";

import { useStore } from "./../../store";

export default function ReviewView(props) {
  const { state, dispatch } = useStore();
  const [showLeaderboard, toggleLeaderboard] = useState(false);

  const roundValidated = () => {
    let validated = true;
    state.activeScorecard.map((player) => {
      for (let i = 1; i <= state.activeLayout; i++) {
            if (!player.holes[i] || player.holes[i] == 0) {
              validated = false;
            }
      }
    });
    return validated;
  };

  let complete_IncompleteRound = roundValidated()
    ? "Round"
    : "Incomplete Round";
  return (
    <div className="reviewView_Div">
      <div className="goBack" onClick={() => props.closeReviewView()}>
        Go back
      </div>
      <h6 className={complete_IncompleteRound} onClick={() => toggleLeaderboard(true)}>
        {`Finish ${complete_IncompleteRound}`}
      </h6>
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
      {showLeaderboard ? (
        <InteractiveModal
          show={showLeaderboard}
          optionalSecondButton={true}
          optionalSecondButtonLabel={"Back"}
          optionalSecondButtonHandler={() => toggleLeaderboard(false)}
          okDisabled={false}
          okLabel={"End Round"}
          header={"LEADERBOARD"}
          leaderboard
          close={() => props.endRound()}
        >
          <Leaderboard />
        </InteractiveModal>
      ) : null}
    </div>
  );
}

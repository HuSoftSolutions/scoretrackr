import React, { useState, useEffect } from "react";
import { useStore } from "./../../store";
import ReviewViewPlayerTable from "./roundTable";
import Button from "react-bootstrap/Button";
// import InteractiveModal from "../Modals_Alerts/interactiveModal";
// import Leaderboard from "./leaderboard";

export default function ReviewView(props) {
  const { state, dispatch } = useStore();
  // const [showLeaderboard, toggleLeaderboard] = useState(false);

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
      <div className="reviewView_PlayerParent_Div">
        <div className="reviewView_PlayerDiv">
          <div className="reviewView_TableDiv">
            <ReviewViewPlayerTable scorecardInfo={props.roundData} />
          </div>
        </div>
      </div>
      {/* {showLeaderboard ? (
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
      ) : null} */}
      <div>
        <Button
          variant={roundValidated() ? "success" : "outline-danger"}
          size="sm"
          name="endRound"
          onClick={() => props.endRound()}
        >
          {`Finish ${complete_IncompleteRound}`}
        </Button>
      </div>
    </div>
  );
}

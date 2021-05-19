import React, {useState, useEffect} from "react";
import {useStore} from "./../../store";
import ReviewViewPlayerTable from "./roundTable";
import Button from "react-bootstrap/Button";
import InteractiveModal from "../Modals_Alerts/interactiveModal";
import Pressing from "./PressingComponent";

export default function ReviewView(props) {
  const {state, dispatch} = useStore();

  const [showPressModal, togglePressModal] = useState(false);
  const [playersAbleToPress, setPlayersAbleToPress] = useState([]);
  const [pressingHole, setPressingHole] = useState();
  const [pressingPlayer, setPressingPlayer] = useState();

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

  const pressingValidated = () => {
    const lastHoleCompleted = lastHoleCompletedCheck(),
      playersAbleToPress = playersToPress(lastHoleCompleted);
    if (playersAbleToPress && playersAbleToPress.length > 0) {
      return false;
    } else return true;
  };

  const activatePressing = () => {
    debugger;
    let updatedScorecard = [...state.activeScorecard];
    let x = pressingPlayer;
    let pressingPlayerIndex = null,
      presseeIndex = null;

    if (playersAbleToPress.length === 1) {
      pressingPlayerIndex = playersAbleToPress[0].presserIndex;
      presseeIndex = playersAbleToPress[0].presseeIndex;
    } else {
      pressingPlayerIndex = pressingPlayer[0].presserIndex;
      presseeIndex = pressingPlayer[0].presseeIndex;
    }

    const existingPresses = updatedScorecard[pressingPlayerIndex].presses
      ? updatedScorecard[pressingPlayerIndex].presses.length
      : null;

      
    const newPressName = `${updatedScorecard[pressingPlayerIndex].name} - Press`;
    const newPress = {
      pressName: newPressName,
      startingHole: pressingHole,
      presseeIndex,
      presserIndex: pressingPlayerIndex
    };

    if (existingPresses) {
      updatedScorecard[pressingPlayerIndex].presses.push(newPress);
    } else {
      updatedScorecard[pressingPlayerIndex].presses = [];
      updatedScorecard[pressingPlayerIndex].presses.push(newPress);
    }

    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });

    setPlayersAbleToPress(playersToPress(pressingHole - 1));
    togglePressModal(false);
  };

  const lastHoleCompletedCheck = () => {
    let lastHole = 0,
      holeComplete = true;

    for (let i = 1; i <= state.activeLayout; i++) {
      state.activeScorecard.map((player) => {
        if (!player.holes[i]) {
          if (holeComplete) {
            lastHole = i - 1;
            holeComplete = false;
          }
        }
      });
    }
    return lastHole;
  };

  const playersToPress = (lastHoleCompleted) => {
    let players = [];
    for (let j = 0; j < state.activeScorecard.length - 1; j++) {
      for (let k = j + 1; k < state.activeScorecard.length; k++) {
        let comparison =
          state.activeScorecard[j].holes[lastHoleCompleted] -
          state.activeScorecard[k].holes[lastHoleCompleted];

        switch (true) {
          case comparison < 0:
            let secondPlayerExistingPresses = state.activeScorecard[k].presses
                ? state.activeScorecard[k].presses
                : [],
              secondPlayerDuplicatePress = secondPlayerExistingPresses.filter(
                (press) =>
                  press.presseeIndex === j &&
                  press.startingHole === lastHoleCompleted + 1
              );
            if (secondPlayerDuplicatePress.length < 1) {
              players.push({
                name: state.activeScorecard[k].name,
                presserIndex: k,
                presseeIndex: j,
                presseeName: state.activeScorecard[j].name,
                hole: lastHoleCompleted,
              });
            }
            break;
          case comparison > 0:
            let existingPresses = state.activeScorecard[j].presses
                ? state.activeScorecard[j].presses
                : [],
              duplicatePress = existingPresses.filter(
                (press) =>
                  press.presseeIndex === k &&
                  press.startingHole === lastHoleCompleted + 1
              );
            if (duplicatePress.length < 1) {
              players.push({
                name: state.activeScorecard[j].name,
                presserIndex: j,
                presseeIndex: k,
                presseeName: state.activeScorecard[k].name,
                hole: lastHoleCompleted,
              });
            }
            break;
          default:
            break;
        }
      }
    }
    return players;
  };

  const pressingButtonHandler = () => {
    const lastHoleCompleted = lastHoleCompletedCheck(),
      playerToPress = playersToPress(lastHoleCompleted);

    setPlayersAbleToPress(playerToPress);
    setPressingHole(lastHoleCompleted + 1);
    togglePressModal(true);
  };

  let complete_IncompleteRound = roundValidated()
    ? "Round"
    : "Incomplete Round";
  return (
    <div className="reviewView_Div">
      <div>
        {state.matchType === "Nassau" && !state.autoPress ? (
          <Button
            variant="success"
            size="sm"
            style={{margin: "10px"}}
            onClick={() => pressingButtonHandler()}
            disabled={pressingValidated()}
          >
            Pressing
          </Button>
        ) : null}
        <Button
          variant={roundValidated() ? "success" : "outline-danger"}
          size="sm"
          style={{margin: "10px"}}
          onClick={() => props.endRound()}
        >
          {`Finish ${complete_IncompleteRound}`}
        </Button>
      </div>
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

      <InteractiveModal
        show={showPressModal}
        optionalSecondButton={true}
        optionalSecondButtonLabel={"Cancel"}
        optionalSecondButtonHandler={() => togglePressModal(false)}
        okDisabled={false}
        okLabel={"Confirm"}
        header={`PRESSING - Hole ${pressingHole - 1}`}
        close={() => activatePressing()}
      >
        <Pressing
          playersPressing={playersAbleToPress}
          setPress={(player) => {
            debugger;
            setPressingPlayer(player);
          }}
        />
      </InteractiveModal>
    </div>
  );
}

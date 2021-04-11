import React, { useState, useEffect } from "react";
import CardDetails from "./cardDetails";
import HoleTracker from "./holeTracker";
import ReviewView from "../ReviewView/reviewView";
import InteractiveModal from "../Modals_Alerts/interactiveModal";
import EditPLayers from "../ScoreTracker/editPlayers";
import Pagination from "@material-ui/lab/Pagination";
import { useStore } from "./../../store";

import "./scoreTracker.css";

export default function ScoreTracker(props) {
  const { state, dispatch } = useStore();
  const [roundLength, setRoundLength] = useState();
  const [roundStart, setRoundStart] = useState(false);
  const [activeHoleIndex, setActiveIndex] = useState(1);

  const [reviewView, toggleReviewView] = useState(false);
  const [editPlayers, toggleEditPlayersModal] = useState(false);
  const [reviewViewRoundData, setReviewViewRoundData] = useState();

  const handlePaginationChange = (e, selectedIndex) => {
    if (selectedIndex !== activeHoleIndex) {
      setActiveIndex(selectedIndex);
    }
  };

  const startRound = () => {
    let roundLengthArray = [];
    let newScorecard = {};
    const players = state.activePlayers;
    players.map((name) => {
      newScorecard = {
        ...newScorecard,
        [name]: {},
      };
    });
    for (let i = 1; i <= state.activeLayout; i++) {
      roundLengthArray.push(i);
    }
    setRoundLength(roundLengthArray);
    setRoundStart(true);
    dispatch({
      type: "update-active-scorecard",
      scorecard: newScorecard,
    });
  };

  const updateScorecard = (player, score, hole) => {
    let newScorecard = state.activeScorecard;
    if (newScorecard[player][hole]) {
      newScorecard[player][hole] = score;
    } else {
      newScorecard[player] = {
        ...newScorecard[player],
        [hole]: score,
      };
    }
    dispatch({
      type: "update-active-scorecard",
      scorecard: newScorecard,
    });
  };

  const getPlayerRoundTotals = () => {
    let totals = {};
    const scorecard = state.activeScorecard ? state.activeScorecard : {};
    state.activePlayers.map((player) => {
      let totalCount = 0,
        rd1Out = null,
        rd1In = null,
        rd2Out = null,
        rd2In = null;
      roundLength.map((hole) => {
        if (scorecard[player]) {
          if (scorecard[player][hole] > 0) {
            if (roundLength.length > 9) {
              switch (true) {
                case (hole < 10):
                  rd1Out += scorecard[player][hole];
                  break;
                case (hole > 9 && hole < 19):
                  rd1In += scorecard[player][hole];
                  break;
                case (hole > 18 && hole < 28):
                  rd2Out += scorecard[player][hole];
                  break;
                case (hole > 27):
                  rd2In += scorecard[player][hole];
                  break;
                default:
                  break;
              }
            }
            totalCount += scorecard[player][hole];
          }
        }
      });
      totals[player] = {
        total: totalCount,
      };
      if (rd1Out) totals[player]["rd1OutTotal"] = rd1Out;
      if (rd1In) totals[player]["rd1InTotal"] = rd1In;
      if (rd2Out) totals[player]["rd2OutTotal"] = rd2Out;
      if (rd2In) totals[player]["rd2InTotal"] = rd2In;
    });
    return totals;
  };

  const openScorecardReview = () => {
    const totals = getPlayerRoundTotals(),
      players = state.activePlayers,
      scorecard = state.activeScorecard;
    let reviewRoundLayout = [],
      inTrue_OutFalse = false;
    for (let i = 1; i <= state.activeLayout; i++) {
      if (state.activeLayout > 9) {
        if (i % 9 == 0) {
          reviewRoundLayout.push(i);
          inTrue_OutFalse == false
            ? reviewRoundLayout.push("OUT")
            : reviewRoundLayout.push("IN");
          inTrue_OutFalse = !inTrue_OutFalse;
        } else reviewRoundLayout.push(i);
      } else reviewRoundLayout.push(i);
    }
    setReviewViewRoundData({ scorecard, players, reviewRoundLayout, totals });
    toggleReviewView(true);
  };

  const addPlayer = () => {
    dispatch({
      type: "add-active-players",
      newPlayer: "",
    });
  };

  const validateActivePlayers = () => {
    const players = state.activePlayers;
    let validated = true;

    players.map((player) => {
      if (player.trim().length < 1) {
        validated = false;
      }
    });
    return validated;
  };

  return (
    <div className="match_container">
      {!roundStart ? (
        <CardDetails startRound={startRound} />
      ) : reviewView ? (
        <ReviewView
          roundData={reviewViewRoundData}
          closeReviewView={() => toggleReviewView(false)}
        />
      ) : (
        <React.Fragment>
          <HoleTracker
            updateScorecard={updateScorecard}
            scorecardReview={openScorecardReview}
            activeIndex={activeHoleIndex}
            roundLength={roundLength}
            editActivePlayers={() => toggleEditPlayersModal(true)}
            endRound={()=> null}
          />
          <Pagination
            count={state.activeLayout}
            page={activeHoleIndex}
            onChange={handlePaginationChange}
            className="navigation"
          />
        </React.Fragment>
      )}
      {editPlayers ? (
        <InteractiveModal
          show={editPlayers}
          optionalSecondButton={true}
          okDisabled={!validateActivePlayers()}
          header={"Edit Players"}
          optionalSecondButtonLabel={"Add Player"}
          optionalSecondButtonHandler={() => addPlayer()}
          close={() => toggleEditPlayersModal(false)}
        >
          <EditPLayers playerList={"active"} />
        </InteractiveModal>
      ) : null}
    </div>
  );
}

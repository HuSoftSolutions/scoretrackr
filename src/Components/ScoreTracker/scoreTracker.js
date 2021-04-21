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
    let roundLengthArray = [],
      newScorecard = state.activeScorecard;

    for (let i = 1; i <= state.activeLayout; i++) {
      roundLengthArray.push(i);
      state.activeScorecard.map((player, index) => {
        newScorecard[index]["holes"] = [];
      });
    }
    setRoundLength(roundLengthArray);
    setRoundStart(true);
    dispatch({
      type: "update-active-scorecard",
      scorecard: newScorecard,
    });
  };

  const getPlayerRoundTotals = () => {
    let totalAddedScorecard = state.activeScorecard;
    state.activeScorecard.map((player, index) => {
      let totalCount = 0;
      player.holes.map((hole) => {
        totalCount += hole;
      });
      totalAddedScorecard[index]["total"] = totalCount;
      debugger;
    });
    dispatch({
      type: "update-active-scorecard",
      scorecard: totalAddedScorecard,
    });
  };

  const openScorecardReview = () => {
    getPlayerRoundTotals();
    let reviewRoundLayout = [],
      nineHoleSplit = [],
      inTrue_OutFalse = false;

    if (!reviewViewRoundData) {
      for (let i = 1; i <= state.activeLayout; i++) {
        if (state.activeLayout > 9) {
          if (i % 9 == 0) {
            nineHoleSplit.push(i);
            if (inTrue_OutFalse === false) {
              nineHoleSplit.push("OUT");
              reviewRoundLayout.push(nineHoleSplit);
              nineHoleSplit = [];
            } else {
              nineHoleSplit.push("IN");
              if (i == state.activeLayout) nineHoleSplit.push("Total");
              reviewRoundLayout.push(nineHoleSplit);
              nineHoleSplit = [];
            }
            inTrue_OutFalse = !inTrue_OutFalse;
          } else nineHoleSplit.push(i);
        } else {
          nineHoleSplit.push(i);
          if (i == state.activeLayout) {
            nineHoleSplit.push("Total");
            reviewRoundLayout.push(nineHoleSplit);
          }
        }
      }
      setReviewViewRoundData(reviewRoundLayout);
    }
    toggleReviewView(true);
  };

  const addPlayer = () => {
    let updatedScorecard = state.activeScorecard;
    updatedScorecard.push({ name: "", "holes": [] });
    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });
  };

  const validateActivePlayers = () => {
    const scorecard = state.activeScorecard;
    let validated = true;
    if (scorecard.length > 0) {
      scorecard.map((player) => {
        if (player.name.trim().length < 1) {
          validated = false;
        }
      });
    } else validated = false;

    return validated;
  };

  return (
    <React.Fragment>
      {!roundStart ? (
        <CardDetails
          startRound={startRound}
          validateActivePlayers={validateActivePlayers}
        />
      ) : reviewView ? (
        <ReviewView
          roundData={reviewViewRoundData}
          closeReviewView={() => toggleReviewView(false)}
        />
      ) : (
        <div className="holeTrackerDiv">
          <HoleTracker
            scorecardReview={openScorecardReview}
            activeIndex={activeHoleIndex}
            roundLength={roundLength}
            editActivePlayers={() => toggleEditPlayersModal(true)}
            endRound={() => null}
          />
          <Pagination
            count={state.activeLayout}
            variant="outlined"
            boundaryCount={2}
            page={activeHoleIndex}
            onChange={handlePaginationChange}
            className="navigation"
          />
        </div>
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
    </React.Fragment>
  );
}

import React, { useState, useEffect } from "react";
import CardDetails from "./cardDetails";
import HoleTracker from "./holeTracker";
import ReviewView from "../ReviewView/reviewView";
import Pagination from '@material-ui/lab/Pagination';
import { useStore } from './../../store';


import "./scoreTracker.css";

export default function ScoreTracker(props) {
  const { state, dispatch } = useStore();
  const [roundLength, setRoundLength] = useState(); 
  const [roundStart, setRoundStart] = useState(false);
  const [activeHoleIndex, setActiveIndex] = useState(1);


  const [ reviewView, toggleReviewView ] = useState(false);
  const [ reviewViewRoundData, setReviewViewRoundData ] = useState();

 
const handlePaginationChange = (e, selectedIndex) => {
  debugger;
    if (selectedIndex !== activeHoleIndex) {
        setActiveIndex(selectedIndex);
    }
  };

  const startRound = () => {
    let roundLengthArray = [];
    let newScorecard = {};
    const players = state.activePlayers;
    players.map((name)=> {
      newScorecard = {
        ...newScorecard,
        [name]: {}
      }
    });
    for(let i = 1; i <= state.activeLayout; i++) {
      roundLengthArray.push(i);
    }
    setRoundLength(roundLengthArray);
    setRoundStart(true);
    dispatch({
      type: "update-active-scorecard", 
      scorecard: newScorecard
    })
  }

  const updateScorecard = (player, score, hole) => {
  let newScorecard = state.activeScorecard;
    if (newScorecard[player][hole]) {
      newScorecard[player][hole] = score;
    }
    else {
      newScorecard[player] = {
        ...newScorecard[player],
        [hole]: score
      }
    }
    console.log(newScorecard);
    dispatch({
      type: 'update-active-scorecard',
      scorecard: newScorecard
    })
  }

  const getPlayerRoundTotals = () => {
    let totals = {};
    const scorecard = state.activeScorecard ? state.activeScorecard : {};
    state.activePlayers.map((player)=> {
    let count = 0;
      roundLength.map((hole)=>{
        if (scorecard[player]) {
          if (scorecard[player][hole] > 0) {
            count += scorecard[player][hole];
          }
        }
      })
      totals[player] = count;
    });
    return totals;
  }

  const openScorecardReview = () => {
     const totals = getPlayerRoundTotals(),  
           players = state.activePlayers,
           scorecard = state.activeScorecard;
     setReviewViewRoundData({scorecard, players, roundLength, totals})
     toggleReviewView(true);
  }

  return (
    <div className="match_container">
      {roundStart && !reviewView ? 
      <React.Fragment>
      <HoleTracker 
        updateScorecard={updateScorecard} 
        scorecardReview={openScorecardReview}
        activeIndex={activeHoleIndex}
        roundLength={roundLength}
        /> 
    <Pagination count={state.activeLayout} page={activeHoleIndex} onChange={handlePaginationChange} className='navigation' />
    </React.Fragment>
    : roundStart && reviewView ?
        <ReviewView roundData={reviewViewRoundData} closeReviewView={()=>toggleReviewView(false)} />
:
      <CardDetails startRound={startRound}/>
    }
    </div>
  );
}

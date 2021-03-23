import React, { useState, useEffect } from "react";
import CardDetails from "./cardDetails";
import HoleTracker from "./holeTracker";
import ReviewView from "../ReviewView/reviewView";
import Pagination from '@material-ui/lab/Pagination';


import "./scoreTracker.css";

export default function ScoreTracker(props) {
  const [players, setPlayers] = useState(['']);
  const [roundLength, setRoundLength] = useState(); 
  const [roundStart, setRoundStart] = useState(false);
  const [scorecard, setScorecard] = useState({});

const [activeHoleIndex, setActiveIndex] = useState(1);


  const [ reviewView, toggleReviewView ] = useState(false);
  const [ reviewViewRoundData, setReviewViewRoundData ] = useState();

 
const handlePaginationChange = (e, selectedIndex) => {
  debugger;
    if (selectedIndex !== activeHoleIndex) {
        setActiveIndex(selectedIndex);
    }
  };

  const startRound = (playerList, roundLength) => {
    let roundLengthArray = [];
    setPlayers(playerList);
    for(let i = 1; i <= roundLength; i++) {
      roundLengthArray.push(i);
    }
    setRoundLength(roundLengthArray);
    setRoundStart(true);
  }

  const updateScorecard = (player, score, hole) => {
    console.log(scorecard);
    setScorecard({...scorecard, [player]: {...scorecard[player], [hole]: score}});
  }

  const getPlayerRoundTotals = () => {
    let totals = {};
    players.map((player)=> {
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
     const totals = getPlayerRoundTotals();   
     setReviewViewRoundData({scorecard, players, roundLength, totals})
     toggleReviewView(true);
  }

  return (
    <div className="match_container">
      {roundStart && !reviewView ? 
      <React.Fragment>
      <HoleTracker 
        playerList={players} 
        roundLength={roundLength} 
        updateScorecard={updateScorecard} 
        scorecardReview={openScorecardReview}
        scorecard={scorecard}
        activeIndex={activeHoleIndex}
        
        /> 
    <Pagination count={roundLength.length} page={activeHoleIndex} onChange={handlePaginationChange} className='navigation' />
    </React.Fragment>
    : roundStart && reviewView ?
        <ReviewView roundData={reviewViewRoundData} closeReviewView={()=>toggleReviewView(false)} />
:
      <CardDetails startRound={startRound}/>
    }
    </div>
  );
}

import React, { useState, useEffect } from "react";
import './holetracker.css';
import PlayerScoreComponent from '../Player/index';
import { useStore } from './../../store';



export default function HoleTracker(props){
  const { state, dispatch } = useStore();

const updateScore = (playerName, score, hole) => {
  props.updateScorecard(playerName, score, hole);
}

return (<React.Fragment>
    <h6 className='ReviewScorecard' onClick={props.scorecardReview} >Review Scorecard</h6>
    <h6 className='ReviewScorecard' onClick={props.editActivePlayers} >Edit Players</h6>
    <h6 className='ReviewScorecard' onClick={props.endRound} >Finish Round</h6>

    {props.roundLength.map((hole)=> (
      <div style={{display: props.activeIndex === hole ? 'block' : 'none'}} key={hole}>
          <h4 className='holeStyle'>HOLE</h4><h1>{hole}</h1> 
          <div>
          {state.activePlayers.map((player, index) => {
                        return <PlayerScoreComponent name={player} key={index} hole={hole} scorecard={state.activeScorecard} setScore={(playerName, score)=> {updateScore(playerName, score, hole)}}/>;
                      })
                }

          </div>

      </div>))}
    </React.Fragment>
)
}
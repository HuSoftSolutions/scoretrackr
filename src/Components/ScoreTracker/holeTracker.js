import React, { useState, useEffect } from "react";
import Pagination from '@material-ui/lab/Pagination';
import './holetracker.css';
import PlayerScoreComponent from '../Player/index';


export default function HoleTracker(props){
const [activeIndex, setActiveIndex] = useState(1);
// const [scorecardValidated, setScorecardValidation] = useState(false);

const handleChange = (e, selectedIndex) => {
  debugger;
    if (selectedIndex !== activeIndex) {
        setActiveIndex(selectedIndex);
    }
  };

// const scorecardValidationCheck = (payload) => {
//   let x = props.getScorecard;
//   let totalRoundHoles = props.roundLength.length;
//   debugger;
// }

const updateScore = (playerName, score, hole) => {
  props.updateScorecard(playerName, score, hole);
}



//bsPrefix='carouselStyle'    vvv
return (<React.Fragment>
    <h6 className='ReviewScorecard' onClick={()=>props.scorecardReview()} >Review Scorecard</h6>
    {props.roundLength.map((hole)=> (
      <div style={{display: activeIndex === hole ? 'block' : 'none'}} key={hole}>
          <h4 className='holeStyle'>HOLE</h4><h1>{hole}</h1> 
          <div>
          {props.playerList.map((player, index) => {
                        return <PlayerScoreComponent name={player} key={index} hole={hole} scorecard={props.scorecard} setScore={(playerName, score)=> {updateScore(playerName, score, hole)}}/>;
                      })
                }
          </div>
      </div>))}
    <Pagination count={props.roundLength.length} page={activeIndex} onChange={handleChange} className='navigation' />
    {/* <Carousel onSelect={handleChange} interval={null} bsPrefix='carouselStyle'  >
        {props.roundLength.map((hole)=> (
        <Carousel.Item key={hole} bsPrefix='carouselItemStyle' >
            <Carousel.Caption bsPrefix='carouselCaptionHeaderStyle'>
              <h4 className='holeStyle'>HOLE</h4><h1>{hole}</h1> 
            </Carousel.Caption>
            <Carousel.Caption bsPrefix='carouselCaptionStyle'>
               
            </Carousel.Caption>
          </Carousel.Item>)
        )}
    
    </Carousel> */}
    
    </React.Fragment>
)
}
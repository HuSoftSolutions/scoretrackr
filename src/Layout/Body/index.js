import React, { Component, useState } from "react";
import { Button } from "react-bootstrap";
import ScoreTracker from "../../Components/ScoreTracker/scoreTracker";
import "./index.css";

const Body = () => {
  const [ createNewScorecard, setCreateScorecard ] = useState(false);

    return (
      <div className="body">
        {createNewScorecard === false ?
         <Button className='createScorecardButton' variant='info' size='lg' type='button' onClick={()=>setCreateScorecard(true)}>
              CREATE SCORECARD
        </Button> :
          <ScoreTracker/>
          }
      </div>
    );
  }

export default Body;

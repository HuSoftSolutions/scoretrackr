import React, { useState, useEffect } from "react";
import RoundTable from "./roundTable";
import PlayerIcon from "../../Icons_Images/playerIcon";


export default function ReviewView(props){

return (
<React.Fragment>
    {props.roundData.players.map((playerName, index)=>{
        return (
        <div key={index}>
            <div className='reviewView_PlayerIcon'>
                {PlayerIcon('', 20)} <h4 style={{paddingLeft: '10px'}}>{playerName}</h4>
            </div>
            <RoundTable player={playerName} scorecardInfo={props.roundData}/>
        </div>
        )
    })
}
<div onClick={()=> props.closeReviewView()}>Go back</div>
</React.Fragment>
)
}
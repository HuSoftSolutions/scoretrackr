import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';
import "./reviewView.css";

const RoundTable = (props) => {
    return (
        <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                    {/* <th>Hole</th> */}
                    {props.scorecardInfo.roundLength.map((hole)=>{
                    return <th key={hole}>{hole}</th>
                    })}
                    <th style={{fontSize: '12px'}}>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    {/* <td>Score</td> */}
                    {props.scorecardInfo.roundLength.map((hole)=> {
                        if (props.scorecardInfo.scorecard[props.player] && props.scorecardInfo.scorecard[props.player][hole] !== undefined) {
                                return <td key={hole}>{props.scorecardInfo.scorecard[props.player][hole]}</td>
                            }
                            else return <td key={hole} className='incompleteHole'>-</td>
                    }
                    )}
                    <td style={{textAlign: 'center'}}>{props.scorecardInfo.totals[props.player]}</td>
                </tr>
            </tbody>
        </Table>
    )
}
export default RoundTable;

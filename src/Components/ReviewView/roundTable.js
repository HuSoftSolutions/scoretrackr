import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

export default function RoundTable(props) {
  const PlayerScoreTableBody = (props) => {
    if (props.props.player.holes[props.hole]) {
      return <td key={props.hole}>{props.props.player.holes[props.hole]}</td>;
    } else if (typeof props.hole == "string") {
      if (props.hole == "OUT" || props.hole == "IN") {
        let total = 0;
        props.props.scorecardInfo[props.holeArrayIndex].map((hole) => {
          if (props.props.player.holes[hole])
            total += props.props.player.holes[hole];
        });
        return <td style={{ textAlign: "center" }}>{total}</td>;
      } else {
        return (
          <td style={{ textAlign: "center" }}>{props.props.player.total}</td>
        );
      }
    } else
      return (
        <td key={props.hole} className="incompleteHole">
          -
        </td>
      );
  };

  const PlayerScoreTable = () => {
    return props.scorecardInfo.map((holeArray, holeArrayIndex) => {
      return (
        <Table striped bordered hover variant="dark" key={holeArrayIndex}>
          <thead>
            <tr>
              {holeArray.map((hole) => (
                <th className="alignTextCenter" key={hole}>
                  {hole}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {holeArray.map((hole, index) => {
                return (
                  <PlayerScoreTableBody
                    hole={hole}
                    holeArrayIndex={holeArrayIndex}
                    index={index}
                    props={props}
                    key={hole}
                  />
                );
              })}
            </tr>
          </tbody>
        </Table>
      );
    });
  };

  return <PlayerScoreTable />;
}

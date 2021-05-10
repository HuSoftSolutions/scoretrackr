import React, { useState, useEffect } from "react";
import { useStore } from "./../../store";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

export default function RoundTable(props) {
  const { state, dispatch } = useStore();

  const PlayerScoreTableBody = (props) => {
    // if (state.matchType === "Stroke") {
      return state.activeScorecard.map((player) => {
        return (
          <tr>
            {props.holeArray.map((hole, index) => {
              if (player.holes[hole]) {
                return <td key={hole}>{player.holes[hole]}</td>;
              } else if (hole == "OUT" || hole == "IN") {
                let total = 0;
                props.scorecardInfo[props.holeArrayIndex].map((holeIndex) => {
                  if (player.holes[holeIndex]) total += player.holes[holeIndex];
                });
                return <td className="alignTextCenter">{total}</td>;
              } else if (hole == "Hole") {
                return <td className="alignTextCenter">{player.name}</td>;
              } else if (hole == "Total") {
                return <td className="alignTextCenter">{player.total}</td>;
              } else
                return (
                  <td key={hole} className="incompleteHole">
                    -
                  </td>
                );
            })}
          </tr>
        );
      });
    // }
    // else if (state.activeScorecard.length > 2) {

    // }
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
            <PlayerScoreTableBody
              holeArray={holeArray}
              holeArrayIndex={holeArrayIndex}
              scorecardInfo={props.scorecardInfo}
            />
          </tbody>
        </Table>
      );
    });
  };

  return <PlayerScoreTable />;
}

import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

export default function RoundTable(props) {
  const PlayerScoreTableBody = (props) => {
    if (
      props.props.scorecardInfo.scorecard[props.props.player] &&
      props.props.scorecardInfo.scorecard[props.props.player][props.hole] !==
        undefined
    ) {
      return (
        <td key={props.hole}>
          {props.props.scorecardInfo.scorecard[props.props.player][props.hole]}
        </td>
      );
    } else if (typeof props.hole == "string") {
      switch (true) {
        case props.hole == "OUT" && props.index < 20:
          return (
            <td style={{ textAlign: "center" }}>
              {props.props.scorecardInfo.totals[props.props.player].rd1OutTotal}
            </td>
          );
        case props.hole == "IN" && props.index < 20:
          return (
            <React.Fragment>
              <td style={{ textAlign: "center" }}>
                {
                  props.props.scorecardInfo.totals[props.props.player]
                    .rd1InTotal
                }
              </td>
              <td style={{ textAlign: "center" }}>
                {props.props.scorecardInfo.totals[props.props.player].total}
              </td>
            </React.Fragment>
          );
        case props.hole == "OUT" && props.index > 20:
          return (
            <td style={{ textAlign: "center" }}>
              {props.props.scorecardInfo.totals[props.props.player].rd2OutTotal}
            </td>
          );
        case props.hole == "IN" && props.index > 20:
          return (
            <React.Fragment>
              <td style={{ textAlign: "center" }}>
                {
                  props.props.scorecardInfo.totals[props.props.player]
                    .rd2OutTotal
                }
              </td>
              <td style={{ textAlign: "center" }}>
                {props.props.scorecardInfo.totals[props.props.player].total}
              </td>
            </React.Fragment>
          );
        default:
          return;
      }
    } else
      return (
        <td key={props.hole} className="incompleteHole">
          -
        </td>
      );
  };

  const PlayerScoreTable = () => {
    return props.scorecardInfo.reviewRoundLayout.map(
      (holeArray, holeArrayIndex) => {
        return (
          <Table striped bordered hover variant="dark" key={holeArrayIndex}>
            <thead>
              <tr>
                {holeArray.map((hole) => (
                  <th className="alignTextCenter" key={hole}>
                    {hole}
                  </th>
                ))}

                {holeArrayIndex % 2 != 0 ? (
                  <th className="tableHeaderWords alignTextCenter">Total</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              <tr>
                {holeArray.map((hole, index) => (
                  <PlayerScoreTableBody
                    hole={hole}
                    holeArrayIndex={holeArrayIndex}
                    index={index}
                    props={props}
                    key={hole}
                  />
                ))}
              </tr>
            </tbody>
          </Table>
        );
      }
    );
  };

  return <PlayerScoreTable />;
}

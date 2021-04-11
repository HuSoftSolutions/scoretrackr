import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

const RoundTable = (props) => {
  return (
    <Table striped bordered hover variant="dark">
      <thead>
        <tr>
          {/* <th>Hole</th> */}
          {props.scorecardInfo.reviewRoundLayout.map((hole, index) => {
            return <th className='alignTextCenter' key={hole}>{hole}</th>;
          })}
          <th className='tableHeaderWords alignTextCenter'>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* <td>Score</td> */}
          {props.scorecardInfo.reviewRoundLayout.map((hole, index) => {
            if (
              props.scorecardInfo.scorecard[props.player] &&
              props.scorecardInfo.scorecard[props.player][hole] !== undefined
            ) {
              return (
                <td key={hole}>
                  {props.scorecardInfo.scorecard[props.player][hole]}
                </td>
              );
            } else if (typeof hole == "string") {
              switch (true) {
                case (hole == "OUT" && index < 20):
                  return (
                    <td style={{ textAlign: "center" }}>
                      {props.scorecardInfo.totals[props.player].rd1OutTotal}
                    </td>
                  );
                case (hole == "IN" && index < 20):
                  return (
                    <td style={{ textAlign: "center" }}>
                      {props.scorecardInfo.totals[props.player].rd1InTotal}
                    </td>
                  );
                case (hole == "OUT" && index > 20):
                  return (
                    <td style={{ textAlign: "center" }}>
                      {props.scorecardInfo.totals[props.player].rd2OutTotal}
                    </td>
                  );
                case (hole == "IN" && index > 20):
                  return (
                    <td style={{ textAlign: "center" }}>
                      {props.scorecardInfo.totals[props.player].rd2OutTotal}
                    </td>
                  );
                default:
                  break;
              }
            } else
              return (
                <td key={hole} className="incompleteHole">
                  -
                </td>
              );
          })}
          <td style={{ textAlign: "center" }}>
            {props.scorecardInfo.totals[props.player].total}
          </td>
        </tr>
      </tbody>
    </Table>
  );
};
export default RoundTable;

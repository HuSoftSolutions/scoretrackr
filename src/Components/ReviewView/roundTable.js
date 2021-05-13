import React, { useState, useEffect } from "react";
import { useStore } from "./../../store";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

export default function RoundTable(props) {
  const { state, dispatch } = useStore();

  const getNineHoleTotal = (scorecardInfo, holeArrayIndex, player) => {
    let total = 0;
    scorecardInfo[holeArrayIndex].map((holeIndex) => {
      if (player.holes[holeIndex]) total += player.holes[holeIndex];
    });
    return total;
  };

  const getMatchPlayResultByHoleForTwo = (
    stopHole,
    scorecardInfo,
    holeArrayIndex,
    firstPlayerIndex,
    secondPlayerIndex,
    fullRound,
    forTotalRow
  ) => {
    let p1matchTotal = 0;

    if (fullRound) {
      scorecardInfo.map((holeArray) => {
        holeArray.map((holeIndex) => {
          if (typeof holeIndex !== "string") {
            if (
              state.activeScorecard[firstPlayerIndex].holes[holeIndex] &&
              state.activeScorecard[secondPlayerIndex].holes[holeIndex]
            ) {
              let comparison =
                state.activeScorecard[firstPlayerIndex].holes[holeIndex] -
                state.activeScorecard[secondPlayerIndex].holes[holeIndex];
              switch (true) {
                case comparison < 0:
                  p1matchTotal += 1;
                  break;
                case comparison > 0:
                  p1matchTotal -= 1;
                  break;
                default:
                  break;
              }
            }
          }
        });
      });
    } else {
      scorecardInfo[holeArrayIndex].map((holeIndex) => {
        if (holeIndex <= stopHole && typeof holeIndex !== "string") {
          if (
            state.activeScorecard[firstPlayerIndex].holes[holeIndex] &&
            state.activeScorecard[secondPlayerIndex].holes[holeIndex]
          ) {
            let comparison =
              state.activeScorecard[firstPlayerIndex].holes[holeIndex] -
              state.activeScorecard[secondPlayerIndex].holes[holeIndex];
            switch (true) {
              case comparison < 0:
                p1matchTotal += 1;
                break;
              case comparison > 0:
                p1matchTotal -= 1;
                break;
              default:
                break;
            }
          } else {
            if (!forTotalRow) {
              if (stopHole === holeIndex) {
                p1matchTotal = "";
              }
            }
          }
        }
      });
    }
    switch (true) {
      case p1matchTotal < 0:
        return state.activeScorecard.length === 2 ? `${Math.abs(p1matchTotal)} UP vv` : p1matchTotal;
      case p1matchTotal > 0:
        return state.activeScorecard.length === 2 ? `${Math.abs(p1matchTotal)} UP ^^` : "+" + p1matchTotal;
      case p1matchTotal === "":
        return p1matchTotal;
      default:
        return "AS";
    }
  };

  const StrokePlayTableBody = (props) => {
    return state.activeScorecard.map((player, playerIndex) => {
      return (
        <React.Fragment>
          <tr>
            {props.holeArray.map((hole, index) => {
              if (player.holes[hole]) {
                return <td key={hole}>{player.holes[hole]}</td>;
              } else if (hole == "OUT" || hole == "IN") {
                let total = getNineHoleTotal(
                  props.scorecardInfo,
                  props.holeArrayIndex,
                  player
                );
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
          {state.matchType !== "Stroke" &&
          state.activeScorecard.length === 2 &&
          playerIndex == 0 ? (
            <tr>
              {props.holeArray.map((hole, index) => {
                if (hole == "Hole") {
                  return <td></td>;
                } else if (hole == "OUT" || hole == "IN") {
                  let lastHole =
                    props.holeArrayIndex === 0
                      ? 9
                      : props.holeArrayIndex === 1
                      ? 18
                      : props.holeArrayIndex === 2
                      ? 27
                      : 36;
                  let total = getMatchPlayResultByHoleForTwo(
                    lastHole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1
                  );
                  return (
                    <td
                      className="alignTextCenter"
                      style={{
                        color:
                          total != "" && total != "AS" ? "yellowgreen" : "",
                      }}
                    >
                      {total}
                    </td>
                  );
                } else if (hole == "Total") {
                  let holeResult = getMatchPlayResultByHoleForTwo(
                    hole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1,
                    true
                  );
                  return (
                    <td
                      className="alignTextCenter"
                      style={{
                        color:
                          holeResult != "" && holeResult != "AS"
                            ? "yellowgreen"
                            : "",
                      }}
                    >
                      {holeResult}
                    </td>
                  );
                } else {
                  let holeResult = getMatchPlayResultByHoleForTwo(
                    hole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1
                  );
                  return (
                    <td
                      className="alignTextCenter"
                      style={{
                        color:
                          holeResult != "" && holeResult != "AS"
                            ? "yellowgreen"
                            : "",
                      }}
                    >
                      {holeResult}
                    </td>
                  );
                }
              })}
            </tr>
          ) : null}
        </React.Fragment>
      );
    });
  };

  const PlayerScoreTables = () => {
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
            <StrokePlayTableBody
              holeArray={holeArray}
              holeArrayIndex={holeArrayIndex}
              scorecardInfo={props.scorecardInfo}
            />
          </tbody>
        </Table>
      );
    });
  };

  const MatchPlayScoreTables = () => {
    let matchCard = [];
    for (let i = 0; i < state.activeScorecard.length - 1; i++) {
      for (let j = i + 1; j < state.activeScorecard.length; j++) {
        let match = {
          name:
            state.activeScorecard[i].name +
            " vs. " +
            state.activeScorecard[j].name,
          firstPlayerIndex: i,
          secondPlayerIndex: j,
        };
        matchCard.push(match);
      }
    }
    return matchCard.map((matchup) => {
      return props.scorecardInfo.map((holeArray, holeArrayIndex) => {
        return (
          <Table striped bordered hover variant="dark" key={holeArrayIndex}>
            <thead>
              <tr>
                <th>{matchup.name}</th>
              </tr>
              <tr>
                {holeArray.map((hole) => {
                  if (hole !== "OUT" && hole !== "IN" && hole !== "Total") {
                    return (
                      <th className="alignTextCenter" key={hole}>
                        {hole}
                      </th>
                    );
                  }
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {holeArray.map((hole) => {
                  if (hole !== "OUT" && hole !== "IN" && hole !== "Total") {
                    if (hole === "Hole") {
                      let front_back_Holes =
                        holeArrayIndex === 0
                          ? "Front" + 9
                          : holeArrayIndex === 1
                          ? "Back" + 9
                          : holeArrayIndex === 2
                          ? "Round 2 Front 9"
                          : "Round 2 Back 9";
                      return (
                        <td className="alignTextCenter" key={hole}>
                          {front_back_Holes}
                        </td>
                      );
                    } else {
                      let holeScore = getMatchPlayResultByHoleForTwo(
                        hole,
                        props.scorecardInfo,
                        holeArrayIndex,
                        matchup.firstPlayerIndex,
                        matchup.secondPlayerIndex
                      );
                      return (
                        <td
                          className="alignTextCenter"
                          key={hole}
                          style={{
                            color:
                              holeScore != "" && holeScore != "AS"
                                ? holeScore < 0 ? "red" : "yellowgreen"
                                : "",
                          }}
                        >
                          {holeScore}
                        </td>
                      );
                    }
                  }
                })}
              </tr>
              <tr>
                {holeArray.map((hole) => {
                  let lastHole =
                    holeArrayIndex === 0
                      ? 9
                      : holeArrayIndex === 1
                      ? 18
                      : holeArrayIndex === 2
                      ? 27
                      : 36;
                  switch (true) {
                    case hole === "Hole" || hole < lastHole:
                      return <td></td>;
                    case hole === lastHole:
											let matchScore = getMatchPlayResultByHoleForTwo(
												lastHole,
												props.scorecardInfo,
												holeArrayIndex,
												matchup.firstPlayerIndex,
												matchup.secondPlayerIndex,
												false,
												true
											);
                      return (
                        <td style={{
													color:
													matchScore != "" && matchScore != "AS"
															? matchScore < 0 ? "red" : "yellowgreen"
															: "",
												}}>
                          {matchScore}
                        </td>
                      );
                    default:
                      return;
                  }
                })}
              </tr>
            </tbody>
          </Table>
        );
      });
    });
  };

  return (
    <div>
      <PlayerScoreTables />
      {state.activeScorecard.length > 2 ? <MatchPlayScoreTables /> : null}
    </div>
  );
}

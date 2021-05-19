import React, {useState, useEffect} from "react";
import {useStore} from "./../../store";
import Table from "react-bootstrap/Table";
import "./reviewView.css";

export default function RoundTable(props) {
  const {state, dispatch} = useStore();

  const getNineHoleTotal = (
    scorecardInfo,
    holeArrayIndex,
    player,
    matchPlay,
    matchup
  ) => {
    let total = 0;
    let lastHole =
      holeArrayIndex === 0
        ? 9
        : holeArrayIndex === 1
        ? 18
        : holeArrayIndex === 2
        ? 27
        : 36;
    if (!matchPlay) {
      scorecardInfo[holeArrayIndex].map((holeIndex) => {
        if (player.holes[holeIndex]) total += player.holes[holeIndex];
      });
      return total;
    } else {
      debugger;
      let presses = player;
      let standardScore = getMatchPlayResultByHoleForTwo(
        lastHole,
        scorecardInfo,
        holeArrayIndex,
        matchup.firstPlayerIndex,
        matchup.secondPlayerIndex,
        false,
        true,
        null,
        true
      );
      total += standardScore;
      if (presses.length > 0) {
        presses.map((press) => {
          if (
            press.presseeIndex == matchup.firstPlayerIndex ||
            press.presseeIndex == matchup.secondPlayerIndex
          ) {
            if (
              press.presserIndex == matchup.firstPlayerIndex ||
              press.presserIndex == matchup.secondPlayerIndex
            ) {
              let pressScore = getMatchPlayResultByHoleForTwo(
                lastHole,
                scorecardInfo,
                holeArrayIndex,
                matchup.firstPlayerIndex,
                matchup.secondPlayerIndex,
                false,
                true,
                press.startingHole,
                true
              );
              debugger;
              total += pressScore;
            }
          }
        });
      }
      let resultSet = {};
      switch (true) {
        case total < 0:
          resultSet.color = "red";
          state.activeScorecard.length === 2
            ? (resultSet.display = `${Math.abs(total)} DN`)
            : (resultSet.display = total);
          break;
        case total > 0:
          resultSet.color = "yellowgreen";
          state.activeScorecard.length === 2
            ? (resultSet.display = `${Math.abs(total)} UP`)
            : (resultSet.display = "+" + total);
          break;
        default:
          resultSet.display = "AS";
          break;
      }
      return resultSet;
    }
  };

  const getMatchPlayResultByHoleForTwo = (
    stopHole,
    scorecardInfo,
    holeArrayIndex,
    firstPlayerIndex,
    secondPlayerIndex,
    fullRound,
    forTotalRow,
    pressStart,
    rawScore
  ) => {
    let p1matchTotal = 0;
    if (fullRound) {
      scorecardInfo.map((holeArray, arrayIndex) => {
        let nineHoleTotal = 0;

        holeArray.map((holeIndex) => {
          if (typeof holeIndex !== "string") {
            if (
              state.activeScorecard[firstPlayerIndex].holes[holeIndex] &&
              state.activeScorecard[secondPlayerIndex].holes[holeIndex]
            ) {
              let comparison =
                state.activeScorecard[firstPlayerIndex].holes[holeIndex] -
                state.activeScorecard[secondPlayerIndex].holes[holeIndex];
              if (pressStart) {
                switch (true) {
                  case pressStart <= holeIndex && comparison < 0:
                    nineHoleTotal += 1;
                    break;
                  case pressStart <= holeIndex && comparison > 0:
                    nineHoleTotal -= 1;
                    break;
                  default:
                    break;
                }
              } else {
                switch (true) {
                  case comparison < 0:
                    nineHoleTotal += 1;
                    break;
                  case comparison > 0:
                    nineHoleTotal -= 1;
                    break;
                  default:
                    break;
                }
              }
            }
          }
        });
        p1matchTotal += nineHoleTotal;
      });
      if (state.matchType === "Nassau") {
        state.activeScorecard.map((player) => {
          if (player.presses) {
            player.presses.map((press) => {
              let arrayIndex, lastHole;
              switch (true) {
                case press.startingHole <= 9:
                  arrayIndex = 0;
                  lastHole = 9;
                  break;
                case press.startingHole <= 18:
                  arrayIndex = 1;
                  lastHole = 18;
                  break;
                case press.startingHole <= 27:
                  arrayIndex = 2;
                  lastHole = 27;
                  break;
                case press.startingHole <= 36:
                  arrayIndex = 3;
                  lastHole = 36;
                  break;
              }
              let pressResults = getMatchPlayResultByHoleForTwo(
                lastHole,
                scorecardInfo,
                arrayIndex,
                0,
                1,
                false,
                true,
                press.startingHole,
                true
              );
              p1matchTotal += pressResults;
            });
          }
        });
      }
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
            if (pressStart) {
              switch (true) {
                case pressStart <= holeIndex && comparison < 0:
                  p1matchTotal += 1;
                  break;
                case pressStart <= holeIndex && comparison > 0:
                  p1matchTotal -= 1;
                  break;
                case pressStart > holeIndex && stopHole === holeIndex:
                  p1matchTotal = "";
                default:
                  break;
              }
            } else {
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
    if (!rawScore) {
      let resultSet = {};
      switch (true) {
        case p1matchTotal < 0:
          resultSet.color = "red";
          state.activeScorecard.length === 2
            ? (resultSet.display = `${Math.abs(p1matchTotal)} DN`)
            : (resultSet.display = p1matchTotal);
          break;
        case p1matchTotal > 0:
          resultSet.color = "yellowgreen";
          state.activeScorecard.length === 2
            ? (resultSet.display = `${Math.abs(p1matchTotal)} UP`)
            : (resultSet.display = "+" + p1matchTotal);
          break;
        case p1matchTotal === "":
          resultSet.display = p1matchTotal;
          break;
        default:
          resultSet.display = "AS";
          break;
      }
      return resultSet;
    } else return p1matchTotal;
  };

  const StrokePlayTableBody = (props) => {
    return state.activeScorecard.map((player, playerIndex) => {
      const presses =
        player.presses && state.activeScorecard.length === 2
          ? player.presses
          : null;
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
          {presses
            ? presses.map((press) => {
                if (props.holeArray.includes(press.startingHole)) {
                  return (
                    <tr>
                      {props.holeArray.map((hole, index) => {
                        if (hole == "Hole") {
                          return (
                            <td className="alignTextCenter">
                              {press.pressName}
                            </td>
                          );
                        } else if (hole == "OUT" || hole == "IN") {
                          let lastHole =
                            props.holeArrayIndex === 0
                              ? 9
                              : props.holeArrayIndex === 1
                              ? 18
                              : props.holeArrayIndex === 2
                              ? 27
                              : 36;
                          let results = getMatchPlayResultByHoleForTwo(
                            lastHole,
                            props.scorecardInfo,
                            props.holeArrayIndex,
                            0,
                            1,
                            false,
                            true,
                            press.startingHole
                          );
                          return (
                            <td
                              className="alignTextCenter"
                              style={{
                                color: results.color ? results.color : "",
                              }}
                            >
                              {results.display}
                            </td>
                          );
                        } else if (hole == "Total") {
                          let holeResult = getMatchPlayResultByHoleForTwo(
                            hole,
                            props.scorecardInfo,
                            props.holeArrayIndex,
                            0,
                            1,
                            true,
                            false,
                            press.startingHole
                          );
                          return (
                            <td
                              className="alignTextCenter"
                              style={{
                                color: holeResult.color ? holeResult.color : "",
                              }}
                            >
                              {holeResult.display}
                            </td>
                          );
                        } else {
                          let holeResult = getMatchPlayResultByHoleForTwo(
                            hole,
                            props.scorecardInfo,
                            props.holeArrayIndex,
                            0,
                            1,
                            false,
                            false,
                            press.startingHole
                          );
                          return (
                            <td
                              className="alignTextCenter"
                              style={{
                                color: holeResult.color ? holeResult.color : "",
                              }}
                            >
                              {holeResult.display}
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                }
              })
            : null}
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
                  let results = getMatchPlayResultByHoleForTwo(
                    lastHole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1,
                    false,
                    true
                  );
                  return (
                    <td
                      className="alignTextCenter"
                      style={{
                        color: results.color ? results.color : "",
                      }}
                    >
                      {results.display}
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
                        color: holeResult.color ? holeResult.color : "",
                      }}
                    >
                      {holeResult.display}
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
                        color: holeResult.color ? holeResult.color : "",
                      }}
                    >
                      {holeResult.display}
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
        <Table
          striped
          bordered
          hover
          variant="dark"
          size="sm"
          key={holeArrayIndex}
        >
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
        let displayPresses = [];
        const firstPlayerPresses =
            state.activeScorecard[matchup.firstPlayerIndex].presses,
          secondPlayerPresses =
            state.activeScorecard[matchup.secondPlayerIndex].presses;
        let pressInstance =
          firstPlayerPresses || secondPlayerPresses ? true : false;
        if (pressInstance) {
          if (firstPlayerPresses) {
            firstPlayerPresses.map((press) => {
              if (
                press.presseeIndex === matchup.secondPlayerIndex &&
                holeArray.includes(press.startingHole)
              ) {
                displayPresses.push(press);
              }
            });
          }
          if (secondPlayerPresses) {
            secondPlayerPresses.map((press) => {
              if (
                press.presseeIndex === matchup.firstPlayerIndex &&
                holeArray.includes(press.startingHole)
              ) {
                displayPresses.push(press);
              }
            });
          }
        }

        return (
          <Table
            striped
            bordered
            hover
            variant="dark"
            size="sm"
            key={holeArrayIndex}
          >
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
                            color: holeScore.color ? holeScore.color : "",
                          }}
                        >
                          {holeScore.display}
                        </td>
                      );
                    }
                  }
                })}
              </tr>
              {displayPresses && displayPresses.length > 0
                ? displayPresses.map((press) => (
                    <tr>
                      {holeArray.map((hole) => {
                        if (
                          hole !== "OUT" &&
                          hole !== "IN" &&
                          hole !== "Total"
                        ) {
                          if (hole === "Hole") {
                            return (
                              <td className="alignTextCenter" key={hole}>
                                {press.pressName}
                              </td>
                            );
                          } else {
                            let holeScore = getMatchPlayResultByHoleForTwo(
                              hole,
                              props.scorecardInfo,
                              holeArrayIndex,
                              matchup.firstPlayerIndex,
                              matchup.secondPlayerIndex,
                              false,
                              false,
                              press.startingHole
                            );
                            return (
                              <td
                                className="alignTextCenter"
                                key={hole}
                                style={{
                                  color: holeScore.color ? holeScore.color : "",
                                }}
                              >
                                {holeScore.display}
                              </td>
                            );
                          }
                        }
                      })}
                    </tr>
                  ))
                : null}
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
                      let matchScore = getNineHoleTotal(
                        props.scorecardInfo,
                        holeArrayIndex,
                        displayPresses,
                        true,
                        matchup
                      );
                      //   lastHole,
                      //   props.scorecardInfo,
                      //   holeArrayIndex,
                      //   matchup.firstPlayerIndex,
                      //   matchup.secondPlayerIndex,
                      //   false,
                      //   true
                      // );
                      return (
                        <td style={{
                          color: matchScore.color ? matchScore.color : ''
												}}>
                          {matchScore.display}
                        </td>
                      );
                      debugger;
                      //
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

import React, {useState, useEffect} from "react";
import {useStore} from "./../../store";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";

import "./reviewView.css";

export default function RoundTable(props) {
  const {state, dispatch} = useStore();

  const pressingValidated = (
    twoPlayer,
    presserIndex,
    presseeIndex,
    holeArray
  ) => {
    const lastHoleCompleted = getLastHoleCompleted();
    let presserScore = 0,
      presseeScore = 0,
      validated,
      presser = presserIndex,
      pressee = presseeIndex;

    if (holeArray.includes(lastHoleCompleted)) {
      if (twoPlayer) {
        state.activeScorecard.map((player, index) => {
          if (index === presserIndex) {
            presserScore = player.holes[lastHoleCompleted];
          } else {
            presseeScore = player.holes[lastHoleCompleted];
            pressee = index;
          }
        });
      } else {
        presserScore =
          state.activeScorecard[presserIndex].holes[lastHoleCompleted];
        presseeScore =
          state.activeScorecard[presseeIndex].holes[lastHoleCompleted];
      }
      let comparison = presserScore - presseeScore;

      switch (true) {
        case comparison < 0 && twoPlayer:
          validated = false;
          break;
        case comparison > 0 && twoPlayer:
          validated = true;
          break;
        case comparison < 0 && !twoPlayer:
          presser = presseeIndex;
          pressee = presserIndex;
          validated = true;
          break;
        case comparison > 0 && !twoPlayer:
          validated = true;
          break;
        default:
          validated = false;
          break;
      }

      if (validated) {
        let alreadyPressedHole = existingPressesCheck(presser, pressee, true);
        if (alreadyPressedHole) validated = false;
      }
    }
    return validated;
  };

  const getLastHoleCompleted = () => {
    let lastHole = 0,
      holeComplete = true;

    for (let i = 1; i <= state.activeLayout; i++) {
      state.activeScorecard.map((player) => {
        if (!player.holes[i]) {
          if (holeComplete) {
            lastHole = i - 1;
            holeComplete = false;
          }
        }
      });
    }
    return lastHole;
  };

  const getEndHole = (holeArrayIndex) => {
    return holeArrayIndex === 0
      ? 9
      : holeArrayIndex === 1
      ? 18
      : holeArrayIndex === 2
      ? 27
      : 36;
  };

  const existingPressesCheck = (
    firstPlayerIndex,
    secondPlayerIndex,
    validation
  ) => {
    const lastHoleCompleted = getLastHoleCompleted();
    if (state.activeScorecard[firstPlayerIndex].presses) {
      if (validation) {
        let alreadyPressed = state.activeScorecard[
          firstPlayerIndex
        ].presses.filter(
          (press) =>
            press.startingHole === lastHoleCompleted + 1 &&
            press.presseeIndex == secondPlayerIndex
        );
        if (alreadyPressed.length > 0) {
          return true;
        } else return false;
      } else return true;
    } else return false;
  };

  const pressingButtonHandler = (twoPlayer, presserIndex, presseeIndex) => {
    const lastHoleCompleted = getLastHoleCompleted();
    let pressee = presseeIndex,
      presser = presserIndex;
    if (twoPlayer) {
      state.activeScorecard.map((player, index) => {
        if (index !== presserIndex) {
          pressee = index;
        }
      });
    } else {
      let firstPlayerScore =
          state.activeScorecard[presserIndex].holes[lastHoleCompleted],
        secondPlayerScore =
          state.activeScorecard[presseeIndex].holes[lastHoleCompleted];
      let comparison = firstPlayerScore - secondPlayerScore;
      if (comparison < 0) {
        presser = presseeIndex;
        pressee = presserIndex;
      }
    }
    setPress(presser, pressee);
  };

  const setPress = (pressingPlayerIndex, presseeIndex) => {
    const lastHoleCompleted = getLastHoleCompleted();
    let updatedScorecard = [...state.activeScorecard];

    const existingPresses = existingPressesCheck(
      pressingPlayerIndex,
      presseeIndex
    );
    const newPressName = `${updatedScorecard[pressingPlayerIndex].name} - Press`;
    const newPress = {
      pressName: newPressName,
      startingHole: lastHoleCompleted + 1,
      presseeIndex,
      presserIndex: pressingPlayerIndex,
    };

    if (existingPresses) {
      updatedScorecard[pressingPlayerIndex].presses.push(newPress);
    } else {
      updatedScorecard[pressingPlayerIndex].presses = [];
      updatedScorecard[pressingPlayerIndex].presses.push(newPress);
    }

    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });
  };

  const getNineHoleTotal = (
    scorecardInfo,
    holeArrayIndex,
    player,
    matchPlay,
    matchup
  ) => {
    let total = 0;
    const lastHole = getEndHole(holeArrayIndex);
    if (!matchPlay) {
      scorecardInfo[holeArrayIndex].map((holeIndex) => {
        if (player.holes[holeIndex]) total += player.holes[holeIndex];
      });
      return total;
    } else {
      const presses = player,
        standardScore = getMatchPlayResultByHoleForTwo(
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
              const comparison =
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
              const pressResults = getMatchPlayResultByHoleForTwo(
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

  const TableCell = (props) => {
    return (
      <td
        className="alignTextCenter"
        style={{
          color: props.cellDetails.color ? props.cellDetails.color : "",
        }}
      >
        {props.cellDetails.display}
      </td>
    );
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
                return (
                  <td className="alignTextCenter tableHeader">
                    {state.matchType === "Nassau" &&
                    state.activeScorecard.length === 2 &&
                    pressingValidated(
                      true,
                      playerIndex,
                      null,
                      props.holeArray
                    ) ? (
                      <Button
                        variant="success"
                        size="sm"
                        style={{margin: "10px"}}
                        onClick={() => pressingButtonHandler(true, playerIndex)}
                      >
                        Press
                      </Button>
                    ) : null}
                    {player.name}
                  </td>
                );
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
                            <td className="alignTextCenter tableHeader">
                              {press.pressName}
                            </td>
                          );
                        } else if (hole == "OUT" || hole == "IN") {
                          const lastHole = getEndHole(props.holeArrayIndex),
                            results = getMatchPlayResultByHoleForTwo(
                              lastHole,
                              props.scorecardInfo,
                              props.holeArrayIndex,
                              0,
                              1,
                              false,
                              true,
                              press.startingHole
                            );
                          return <TableCell cellDetails={results} />;
                        } else if (hole == "Total") {
                          const holeResult = getMatchPlayResultByHoleForTwo(
                            hole,
                            props.scorecardInfo,
                            props.holeArrayIndex,
                            0,
                            1,
                            true,
                            false,
                            press.startingHole
                          );
                          return <TableCell cellDetails={holeResult} />;
                        } else {
                          const holeResult = getMatchPlayResultByHoleForTwo(
                            hole,
                            props.scorecardInfo,
                            props.holeArrayIndex,
                            0,
                            1,
                            false,
                            false,
                            press.startingHole
                          );
                          return <TableCell cellDetails={holeResult} />;
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
                  const lastHole = getEndHole(props.holeArrayIndex),
                    results = getMatchPlayResultByHoleForTwo(
                      lastHole,
                      props.scorecardInfo,
                      props.holeArrayIndex,
                      0,
                      1,
                      false,
                      true
                    );
                  return <TableCell cellDetails={results} />;
                } else if (hole == "Total") {
                  const holeResult = getMatchPlayResultByHoleForTwo(
                    hole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1,
                    true
                  );
                  return <TableCell cellDetails={holeResult} />;
                } else {
                  const holeResult = getMatchPlayResultByHoleForTwo(
                    hole,
                    props.scorecardInfo,
                    props.holeArrayIndex,
                    0,
                    1
                  );
                  return <TableCell cellDetails={holeResult} />;
                }
              })}
            </tr>
          ) : null}
        </React.Fragment>
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
                <th className={"tableHeader"}>
                  {state.matchType === "Nassau" &&
                  pressingValidated(
                    false,
                    matchup.firstPlayerIndex,
                    matchup.secondPlayerIndex,
                    holeArray
                  ) ? (
                    <Button
                      variant="success"
                      size="sm"
                      style={{margin: "10px"}}
                      onClick={() =>
                        pressingButtonHandler(
                          false,
                          matchup.firstPlayerIndex,
                          matchup.secondPlayerIndex
                        )
                      }
                    >
                      Press
                    </Button>
                  ) : null}
                  {matchup.name}
                </th>
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
                      const holeScore = getMatchPlayResultByHoleForTwo(
                        hole,
                        props.scorecardInfo,
                        holeArrayIndex,
                        matchup.firstPlayerIndex,
                        matchup.secondPlayerIndex
                      );
                      return <TableCell cellDetails={holeScore} />;
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
                            const holeScore = getMatchPlayResultByHoleForTwo(
                              hole,
                              props.scorecardInfo,
                              holeArrayIndex,
                              matchup.firstPlayerIndex,
                              matchup.secondPlayerIndex,
                              false,
                              false,
                              press.startingHole
                            );
                            return <TableCell cellDetails={holeScore} />;
                          }
                        }
                      })}
                    </tr>
                  ))
                : null}
              <tr>
                {holeArray.map((hole) => {
                  const lastHole = getEndHole(holeArrayIndex);
                  switch (true) {
                    case hole === "Hole" || hole < lastHole:
                      return <td></td>;
                    case hole === lastHole:
                      const matchScore = getNineHoleTotal(
                        props.scorecardInfo,
                        holeArrayIndex,
                        displayPresses,
                        true,
                        matchup
                      );
                      return <TableCell cellDetails={matchScore} />;
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

  return (
    <div>
      <PlayerScoreTables />
      {state.activeScorecard.length > 2 ? <MatchPlayScoreTables /> : null}
    </div>
  );
}

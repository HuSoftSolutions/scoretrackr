import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./editPlayers.css";
import PlayerIcon from "../../Icons_Images/playerIcon";

import { useStore } from "./../../store";

export default function EditPlayers(props) {
  const { state, dispatch } = useStore();

  const onRemovePlayer = (target, playerIndex) => {
    const updatedScorecard = state.activeScorecard.filter(
      (player, index) => index !== playerIndex
    );
    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });
  };

  const onChangePlayerName = (value, index) => {
    let updatedScorecard = state.activeScorecard;
    updatedScorecard[index] = { ...updatedScorecard[index], name: value };

    dispatch({
      type: "update-active-scorecard",
      scorecard: updatedScorecard,
    });
  };

  const removePlayerButton = (index, lastPlayerNotRemoved) => {
    if (!lastPlayerNotRemoved) {
      return (<div className="removePlayerButtonDiv">
        <Button
          variant="outline-danger"
          size="sm"
          name="removePlayer"
          onClick={({ target }) => onRemovePlayer(target, index)}
        >
          X
        </Button>
</div>
      );
    } else
      return index !== 0 ? (
        <div className="removePlayerButtonDiv">
        <Button
          variant="outline-danger"
          size="sm"
          name="removePlayer"
          onClick={({ target }) => onRemovePlayer(target, index)}
        >
          X
        </Button>
        </div>
      ) : null;
  };

  const Player = (player, index, lastPlayerNotRemoved = false) => {
    return (
      <div className="playerDiv" key={index}>
        {/* <div className="justifyCenter"> */}
          <InputGroup.Prepend>
            <InputGroup.Text id="playerNames" style={{ padding: ".375rem" }}>
              {PlayerIcon("")}
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            className={`${props.largeInput ? "eightyPercentWidth" : "playerInput"}`}
            onChange={({ target }) => onChangePlayerName(target.value, index)}
            aria-describedby="playerNames"
            aria-label="Username"
            placeholder="ex: John Doe"
            size="sm"
            name="playerName"
            value={player.name}
          />
        {/* </div> */}
          {removePlayerButton(index, lastPlayerNotRemoved)}
      </div>
    );
  };

  const playerList = () => {
    if (props.playerList === "active") {
      return state.activeScorecard;
    }
  };
  return (
    <React.Fragment>
      {playerList().map((player, index) => {
        if (props.cardDetails) {
          if (index != 0) {
            return Player(player, index);
          }
        } else return Player(player, index, true);
      })}
    </React.Fragment>
  );
}

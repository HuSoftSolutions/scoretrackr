import React, { useState } from "react";
import { Card, Container, Col, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import PlayerComponent from "../Player";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PlayersComponent(props) {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");

  const addPlayer = () => {
    if (newPlayer == "") return;

    var n = [...players, newPlayer];
    console.log(n);
    setPlayers(n);
    setNewPlayer("");
  };

  const noPlayersComponent = () => {
    return <div className="pNoPlayers">No Players Added :(</div>;
  };

  const newPlayerNameUpdated = (event) => {
    setNewPlayer(event.target.value);
  };

  return (
    <div className="pContainer">
      <div className="pHeader">
        <div className="pInput">
          <InputGroup className="mb-3" size="lg">
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1">Player Name</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              placeholder="ex: John Doe"
              aria-label="Username"
              aria-describedby="basic-addon1"
              value={newPlayer}
              onChange={newPlayerNameUpdated}
            />
            <Button
              disabled={newPlayer.trim() === ""}
              className="pSubmit"
              size="lg"
              variant="primary"
              onClick={addPlayer}
            >
              Add Player
            </Button>
          </InputGroup>
        </div>
      </div>
      <div className="pPlayers">
        {players.length === 0
          ? noPlayersComponent()
          : players.map((player) => {
              return <PlayerComponent name={player} />;
            })}
      </div>
    </div>
  );
}

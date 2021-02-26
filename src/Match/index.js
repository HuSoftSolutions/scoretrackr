import React, { useState, useEffect } from "react";
import { Card } from "react-bootstrap";
import PlayersComponent from "../Players";
import "./index.css";

export default function MatchComponent() {
  const [players, setPlayers] = useState([
    { name: "Johnny" },
    { name: "Richard" },
  ]);

  const columns = [
    {
      dataField: "name",
      text: "Players",
    },
  ];

  return (
    <div className="match_container">
      <PlayersComponent />
    </div>
  );
}

import {useState} from "react";
import {Form} from "react-bootstrap";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import {useStore} from "../../store";

export default function PressingComponent(props) {
  const {state, dispatch} = useStore();

  const [pressingPlayer, setPressingPlayer] = useState("");
  const [playerPressed, setPlayerPressed] = useState("");

  // let sortedScorecard = [...state.activeScorecard];

  const SinglePress = () => {
    let message = `${props.playersPressing[0].name} wants to press ${props.playersPressing[0].presseeName} ?`;
    return <div>{message}</div>;
  };

  const pressingHander = ({target}) => {
      switch (target.name) {
        case "pressee":
          setPlayerPressed(target.value);
          let player = props.playersPressing.filter(
            (playr) => playr.presseeIndex == target.value && playr.presserIndex == pressingPlayer
          );
          props.setPress(player);
          break;
        case "presser":
          setPressingPlayer(target.value);
          break;
        default:
          break;
      }
  };

  const PresserDropdown = () => {
    let playerToPress = [...props.playersPressing];
    let distinctPlayersToPress = [];
    playerToPress.map((player, index) => {
      if (index === 0) {
        distinctPlayersToPress.push(player);
      } else {
        let distinct = distinctPlayersToPress.filter(
          (dPlayer) => dPlayer.presserIndex === player.presserIndex
        );
        if (distinct.length < 1) {
          distinctPlayersToPress.push(player);
        }
      }
    });
    return (
      <div>
        <Select
          value={pressingPlayer}
          displayEmpty
          onChange={pressingHander}
          name="presser"
        >
          <MenuItem value="" disabled>
            Player
          </MenuItem>
          {distinctPlayersToPress.map((player) => (
            <MenuItem key={player.name} value={player.presserIndex}>{player.name}</MenuItem>
          ))}
        </Select>
      </div>
    );
  };

  const PresseeDropdown = () => {
    let playersToBePressed = [];
    props.playersPressing.map((player) => {
      if (player.presserIndex === pressingPlayer) {
        playersToBePressed.push(player);
      }
    });
    return (
      <div>
        <Select
          value={playerPressed}
          displayEmpty
          onChange={pressingHander}
          name="pressee"
          disabled={pressingPlayer !== "" ? false : true}
        >
          <MenuItem value="" disabled>
            Player
          </MenuItem>
          {playersToBePressed.map((player) => (
            <MenuItem key={player.presseeName} value={player.presseeIndex}>
              {player.presseeName}
            </MenuItem>
          ))}
        </Select>
      </div>
    );
  };

  return (
    <div>
      {props.playersPressing.length === 1 ? (
        <SinglePress />
      ) : (
        <div>
          <PresserDropdown />
          <Form.Label>wants to press</Form.Label>
          <PresseeDropdown />
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import PlayerIcon from "../../Icons_Images/playerIcon";
import { Form, InputGroup } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useStore } from './../../store';
import "./cardDetails.css";

export default function CardDetails(props){
    const {state, dispatch} = useStore();
    const [validated, setValidation] =  useState(false);

    const updateCardDetails = (eventTarget, value) => {
        const action = eventTarget.name;
        switch (action) {
            case 'layoutSelection':
                dispatch({
                    type: "update-active-layout",
                    activeLayout: value 
                  });
            break;
            case 'addPlayer':
                dispatch({
                    type: "add-active-players",
                    newPlayer: ''
                  });
                setValidation(false);
                break;
            case 'removePlayer':
                const newActivePlayers = state.activePlayers.filter((player, index)=> index !== value);
                dispatch({
                    type: "remove-active-players",
                    activePlayers: newActivePlayers
                  });
                setValidation(false);
                break;
            default:
        }
    };

    const playerInputHandler = (value, index) => {
        let newPlayers = state.activePlayers;
        state.activePlayers.map((player, pIndex)=>{
             if (pIndex === index) {
                newPlayers[index] = value
             }  
        });
        dispatch({
            type: "update-active-players", 
            activePlayers: newPlayers
        })
        validationCheck(newPlayers);
    };

    const validationCheck = (players) => {
        let validated = true;

        players.map((player) => {
            if (player.trim().length < 1) {
                validated = false;
            }
        });
        setValidation(validated);
    }

    const startRound = () => {
        props.startRound();
    }

    const holeFormats = [9, 18, 27, 36];
    return (
        <div className='cardDetails'>
            <div className='cardDetailsHeader'>
                <h4>Card Details</h4>
            </div>
           <Form className="cardDetailsForm" >
               <Form.Group className="layoutPadding">
                <Form.Label>Choose Hole Layout:</Form.Label>
                <ButtonGroup size="sm" className='holeAmountButtonGroup'>
                    {holeFormats.map((holeAmount)=> 
                        <Button name='layoutSelection' 
                            variant={holeAmount === state.activeLayout ? 'info' : 'light'} 
                            onClick={({target})=> updateCardDetails(target, holeAmount)}>
                                {holeAmount}H
                        </Button>
                    )}
                </ButtonGroup>
               </Form.Group>
               <Form.Label>Players:</Form.Label>
               <Form.Group controlId="playersInput" className="playerInputGroup">
                    <div className="playerDiv">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="playerName" style={{'padding': '.375rem'}}>{PlayerIcon('')}</InputGroup.Text>
                    </InputGroup.Prepend>
                       
                        <Form.Control aria-label="Username" placeholder="ex: John Doe" size="sm" name="playerName" aria-describedby="playerName" className="playerInput" onChange={({target})=> playerInputHandler(target.value, 0)}/>
                        
                    </div>
                        {state.activePlayers ? state.activePlayers.length > 1 ?
                         state.activePlayers.map((player, index) => {
                             if (index !== 0) {
                                return  (
                                <div className="playerDiv" key={index}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="playerNames" style={{'padding': '.375rem'}}>{PlayerIcon('')}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="playerInput" onChange={({target})=> playerInputHandler(target.value, index)} aria-describedby="playerNames" aria-label="Username" placeholder="ex: John Doe" size="sm" name="playerName" />
                                    <Button variant="outline-danger" size="sm" name="removePlayer" onClick={({target})=>updateCardDetails(target, index)}>X</Button>
                                </div>
                                )}
                        }): null : null}
               </Form.Group>
           </Form>
           <div className="startRoundButtonDiv">
                <Button className="addPlayerButton" type="button" size="sm" variant="success" name="addPlayer" onClick={({target})=>updateCardDetails(target)}>Add Player</Button>
                 <Button type="button" variant='info' disabled={!validated} onClick={startRound}>Start Round</Button>
               </div>
        </div>
    );
}
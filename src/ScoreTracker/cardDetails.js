import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import PlayerIcon from "../../Icons_Images/playerIcon";
import { Form, InputGroup } from "react-bootstrap";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import "./cardDetails.css";

export default function CardDetails(props){
    const [chooseLayout, setChosenLayout] = useState(18);
    const [players, setPlayers] = useState(['']);
    const [validated, setValidation] =  useState(false);

    const updateCardDetails = (eventTarget, details) => {
        debugger;
        const detail = eventTarget.name,
        value = details;
        switch (detail) {
            case 'layoutSelection':
                setChosenLayout(value)
            break;
            case 'addPlayer':
                setPlayers((prev)=>{
                    return [...prev, '']
                });
                setValidation(false);
                break;
            default:
        }
    };

    const playerInputHandler = (value, index) => {
        let newPlayers = players;
        players.map((player, pIndex)=>{
             if (pIndex === index) {
                newPlayers[index] = value
             }  
        });
        setPlayers(newPlayers);
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
        props.startRound(players, chooseLayout);
    }

    return (
        <div className='cardDetails'>
            <div className='cardDetailsHeader'>
                <h4>Card Details</h4>
            </div>
           <Form className="cardDetailsForm" >
               <Form.Group className="layoutPadding">
                <Form.Label>Choose Layout:</Form.Label>
                <ButtonGroup size="sm" className='holeAmountButtonGroup'>
                    <Button name='layoutSelection' 
                        variant={chooseLayout === 18 ? 'info' : 'light'} 
                        onClick={({target})=> updateCardDetails(target,18)}>
                            18
                    </Button>
                     <Button name='layoutSelection' 
                        onClick={({target})=> updateCardDetails(target,27)} 
                        variant={chooseLayout === 27 ? 'info' : 'light'}>
                            27
                    </Button>
                     <Button name='layoutSelection' 
                        variant={chooseLayout === 36 ? 'info' : 'light'}
                        onClick={({target})=> updateCardDetails(target,36)}>
                            36
                    </Button>
                </ButtonGroup>
               {/* <div key={`inline-radio`} className="mb-3" required>
                    <Form.Check inline label="18 Holes" type={'radio'} name='layoutSelection' defaultChecked onChange={({target})=> updateCardDetails(target,18)}/>
                    <Form.Check inline label="27 Holes" type={'radio'} name='layoutSelection'  onChange={({target})=>updateCardDetails(target,27)}/>
                    <Form.Check inline label="36 Holes" type={'radio'} name='layoutSelection'  onChange={({target})=>updateCardDetails(target,36)}/>
                </div> */}
               </Form.Group>
               <Form.Label>Players:</Form.Label>
               <Form.Group controlId="playersInput" className="playerInputGroup">
                    <div className="playerDiv">
                    <InputGroup.Prepend>
                        <InputGroup.Text id="playerName" style={{'padding': '.375rem'}}>{PlayerIcon('')}</InputGroup.Text>
                    </InputGroup.Prepend>
                       
                        <Form.Control aria-label="Username" placeholder="ex: John Doe" size="sm" name="playerName" aria-describedby="playerName" className="playerInput" onChange={({target})=> playerInputHandler(target.value, 0)}/>
                        <Button className="addPlayerButton" type="button" size="sm" variant="success" name="addPlayer" onClick={({target})=>updateCardDetails(target)}>Add Player</Button>
                    </div>
                        {players.length > 1 ?
                         players.map((player, index) => {
                             if (index !== 0) {
                                return  (
                                <div className="playerDiv" key={index}>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="playerNames" style={{'padding': '.375rem'}}>{PlayerIcon('')}</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="playerInput" onChange={({target})=> playerInputHandler(target.value, index)} aria-describedby="playerNames" aria-label="Username" placeholder="ex: John Doe" size="sm" name="playerName" />
                                </div>
                                )}
                        }): null}
               </Form.Group>
               <div className="startRoundButtonDiv">
                 <Button type="button" variant='info' disabled={!validated} onClick={startRound}>Start Round</Button>
               </div>
           </Form>
        </div>
    );
}
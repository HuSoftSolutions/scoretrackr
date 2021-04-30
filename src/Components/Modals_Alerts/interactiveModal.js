import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useStore } from "./../../store";
import "./modal.css";

export default function InteractiveModal(props) {
  const { state, dispatch } = useStore();

  const handleClose = () => {
    props.close();
  };

  return (
    <Modal show={props.show}>
      <Modal.Header className="justifyCenter" >
        <Modal.Title>{props.header}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="">{props.children}</Modal.Body>
      <Modal.Footer>
        {props.optionalSecondButton ? (
          <Button
          type="button"
          variant="success"
          onClick={()=>props.optionalSecondButtonHandler()}
        >
           {props.optionalSecondButtonLabel}
        </Button> 
        ) : null}
        <Button variant="primary" onClick={handleClose} disabled={props.okDisabled}>
          {props.okLabel ? props.okLabel : "Done"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

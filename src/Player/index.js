import React from 'react'
import Button from 'react-bootstrap/Button'
import "./index.css"

export default function index(props) {
    return (
        <div className="plContainer">
            <p className="plName">{props.name}</p>
            <Button variant="danger" size="sm">X</Button>
        </div>
    )
}

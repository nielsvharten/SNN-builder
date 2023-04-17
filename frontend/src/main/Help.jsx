import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

class Help extends Component {
  render() {
    const { keyMap, show, onClose } = this.props;
    const labels = {
      ADD_LIF: "Insert LIF neuron",
      ADD_INPUT: "Insert Input Train",
      ADD_RANDOM: "Insert Random Spiker",
      CONNECT_MODE: "Connect this node to another",
      DELETE_SELECTED: "Delete selected node/synapse",
      UNDO: "Undo last action",
      REDO: "Redo last action",
      EXECUTE: "Execute network",
      EDIT: "Edit network",
    };

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Help</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <h5>Global hotkeys</h5>
            {Object.entries(keyMap).map(([key, value]) => (
              <Form.Group>
                {labels[key]}: <b>{value}</b>
              </Form.Group>
            ))}
            <br />
            <h5>Other functionality</h5>
            <p>
              Insert infinity as property value if applicable using
              <b> ctrl+shift+8</b>
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Help;

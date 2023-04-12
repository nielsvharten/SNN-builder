import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

class Help extends Component {
  render() {
    const { keyMap, show, onClose } = this.props;
    
    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Hotkeys</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.entries(keyMap).map(([key, value]) => (
              <Form.Group>
                {key}: <b>{value}</b>
              </Form.Group>
            ))}
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

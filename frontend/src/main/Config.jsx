import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

class Config extends Component {
  getAlert(nodeName) {
    return (
      <Alert className="m-3" variant="danger" severity="error">
        A non-default value is specified for node {nodeName}
      </Alert>
    );
  }

  getFeatureCheckbox(feature, value, label) {
    const { error, onToggleFeature } = this.props;
    return (
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label={label}
          checked={value}
          onChange={(e) => onToggleFeature(feature, e.target.checked)}
        />
        {error && error.option.name === feature
          ? this.getAlert(error.nodeName)
          : null}
      </Form.Group>
    );
  }

  render() {
    const { show, error, optionalFeatures, onClose } = this.props;
    const labels = {
      V_min: "Minimal voltage (default: 0)",
      amplitude: "Amplitude of output spikes (default: 1)",
      I_e: "Constant input current (default: 0)",
      noise: "Add noise each time step (default: 0)",
      rng: "Seed of random generator (default: Random)",
    };

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Enable optional values to be specified</Form.Label>
            {Object.entries(optionalFeatures).map(([feature, value]) =>
              this.getFeatureCheckbox(feature, value, labels[feature])
            )}
            <br />
            <Form.Label>Synapse rules</Form.Label>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow synapse from a node to itself"
                checked
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Allow multiple synapses from one node to another"
              />
            </Form.Group>
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

export default Config;

import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

class Config extends Component {
  getAlert(feature, details = null) {
    let message = "A non-default value is specified for node " + details.name;
    if (feature === "selfLoops") {
      message = "A self-loop exists in the network";
    } else if (feature === "synapseBundles") {
      message = "There are multiple synapses from one node to another";
    }
    return (
      <Alert className="m-3" variant="danger" severity="error">
        {message}
      </Alert>
    );
  }

  getFeatureCheckbox(type, feature, value, label) {
    const { error, onToggleFeature } = this.props;
    return (
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label={label}
          checked={value}
          onChange={(e) => onToggleFeature(type, feature, e.target.checked)}
        />
        {error && error.feature === feature
          ? this.getAlert(feature, error.details)
          : null}
      </Form.Group>
    );
  }

  render() {
    const { show, config, onClose } = this.props;
    const labels = {
      V_min: "Minimal voltage (default: 0)",
      amplitude: "Amplitude of output spikes (default: 1)",
      I_e: "Constant input current (default: 0)",
      noise: "Add noise each time step (default: 0)",
      rng: "Seed of random generator (default: Random)",
      selfLoops: "Allow synapse from a node to itself",
      synapseBundles: "Allow multiple synapses from one node to another",
    };

    return (
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Configuration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Enable optional values to be specified</Form.Label>
            {Object.entries(config.nodeFeatures).map(([feature, value]) =>
              this.getFeatureCheckbox(
                "nodeFeatures",
                feature,
                value,
                labels[feature]
              )
            )}
            <br />
            <Form.Label>Synapse rules</Form.Label>
            {Object.entries(config.synapseRules).map(([feature, value]) =>
              this.getFeatureCheckbox(
                "synapseRules",
                feature,
                value,
                labels[feature]
              )
            )}
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

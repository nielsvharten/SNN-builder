import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import data from "./options.json";

// import options from options.json
const { options } = data;

class Config extends Component {
  nodeFeatureNonDefault(feature, network) {
    const option = options.node[feature];
    const nonDefault = network.nodes.find(
      (node) =>
        node[feature] && node[feature].toString() !== option.default.toString()
    );

    return nonDefault;
  }

  synapseRuleBroken(feature, network) {
    if (feature === "synapseBundles") {
      let example = null;
      let connections = {};

      network.synapses.every((s) => {
        if (connections[[s.pre, s.post]]) {
          example = s;
          return false;
        }

        connections[[s.pre, s.post]] = 1;
        return true;
      });

      return example;
    } else if (feature === "selfLoops") {
      return network.synapses.find((s) => s.pre === s.post);
    }
  }

  handleToggleFeature = (type, feature, enabled) => {
    const { network, onConfigError, onToggleFeature } = this.props;

    // on disable, check if rules are satisfied
    if (!enabled) {
      let error = undefined;
      if (type === "synapseRules") {
        error = this.synapseRuleBroken(feature, network);
      } else if (type === "nodeFeatures") {
        error = this.nodeFeatureNonDefault(feature, network);
      }

      if (error) {
        onConfigError(feature, error);
        return;
      }
    }

    onToggleFeature(type, feature, enabled);
  };

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
    const { error } = this.props;
    return (
      <Form.Group key={feature} className="mb-3">
        <Form.Check
          type="checkbox"
          label={label}
          checked={value}
          onChange={(e) =>
            this.handleToggleFeature(type, feature, e.target.checked)
          }
        />
        {error && error.feature === feature
          ? this.getAlert(feature, error.details)
          : null}
      </Form.Group>
    );
  }

  render() {
    const { show, network, onClose } = this.props;
    const { nodeFeatures, synapseRules } = network.config;
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
            {Object.entries(nodeFeatures).map(([feature, value]) =>
              this.getFeatureCheckbox(
                "nodeFeatures",
                feature,
                value,
                labels[feature]
              )
            )}
            <br />
            <Form.Label>Synapse rules</Form.Label>
            {Object.entries(synapseRules).map(([feature, value]) =>
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

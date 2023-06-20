import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

import Network from "../model/network";
import data from "./options.json";

class Config extends Component {
  nodeFeatureNonDefault(feature, network) {
    const { loihiRestrictions } = network.config.loihi;

    // import options from options.json
    const { options } = loihiRestrictions ? data["loihi"] : data["simulator"];

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

  handleSwitchConfig = (enabled) => {
    const CONFIRM_TEXT =
      "Have you saved your progress? The current network will be lost";

    if (window.confirm(CONFIRM_TEXT)) {
      const { onChangeNetwork } = this.props;
      let network = new Network();
      network["config"]["loihi"]["loihiRestrictions"] = enabled;

      onChangeNetwork(network);
    }
  };

  handleToggleFeature = (type, feature, enabled) => {
    const { network, onConfigError, onToggleFeature } = this.props;

    if (feature === "loihiRestrictions") {
      // on toggle loihiRestrictions: start with new network
      this.handleSwitchConfig(enabled);
      return;
    }

    let error = undefined;
    if (!enabled) {
      // on disable, check if rules are satisfied
      if (type === "synapseRules") {
        error = this.synapseRuleBroken(feature, network);
      } else if (type === "nodeFeatures") {
        error = this.nodeFeatureNonDefault(feature, network);
      }
    }

    if (error) {
      onConfigError(feature, error);
      return;
    }

    onToggleFeature(type, feature, enabled);
  };

  getAlert(feature, details = null) {
    const messages = {
      V_min:
        "A non-default minimum voltage is specified for node " + details.name,
      amplitude:
        "A non-default amplitude is specified for node " + details.name,
      I_e: "A non-default input current is specified for node " + details.name,
      noise: "A non-default noise value is specified for node " + details.name,
      rng: "A random generator seed is specified for node " + details.name,
      selfLoops: "A self-loop exists in the network",
      synapseBundles: "There are multiple synapses from one node to another",
      loihiExecution:
        "May only execute on Loihi if hardware restrictions are enabled",
      matchWithSimulator:
        "Can only match with simulator when executing on Loihi",
    };

    return (
      <Alert className="m-3" variant="danger" severity="error">
        {messages[feature]}
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
    const { nodeFeatures, synapseRules, loihi } = network.config;
    const labels = {
      V_min: "Minimal voltage (default: 0)",
      amplitude: "Amplitude of output spikes (default: 1)",
      I_e: "Constant input current (default: 0)",
      noise: "Add noise each time step (default: 0)",
      rng: "Seed of random generator (default: Random)",
      selfLoops: "Allow synapse from a node to itself",
      synapseBundles: "Allow multiple synapses from one node to another",
      loihiRestrictions: "Apply hardware restrictions for Loihi",
      loihiExecution: "Execute on Loihi",
      matchWithSimulator: "Check Loihi's measurements with the simulator",
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
            <br />
            <Form.Label>Execute on Loihi</Form.Label>
            {this.getFeatureCheckbox(
              "loihi",
              "loihiRestrictions",
              loihi["loihiRestrictions"],
              labels["loihiRestrictions"]
            )}
            {loihi["loihiRestrictions"] // only show loihi execution if restrictions are enabled
              ? this.getFeatureCheckbox(
                  "loihi",
                  "loihiExecution",
                  loihi["loihiExecution"],
                  labels["loihiExecution"]
                )
              : null}
            {loihi["loihiExecution"] // only show match with simulator if loihi execution is enabled
              ? this.getFeatureCheckbox(
                  "loihi",
                  "matchWithSimulator",
                  loihi["matchWithSimulator"],
                  labels["matchWithSimulator"]
                )
              : null}
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

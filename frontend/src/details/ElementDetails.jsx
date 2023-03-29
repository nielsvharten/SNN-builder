import React, { Component } from "react";
import Option from "./Option";
import data from "./options.json";

// import options from options.json
const { allOptions } = data;

class ElementDetails extends Component {
  getConfigOption(element, elementType, option) {
    const { editMode, onChangeOption, onBlurOption } = this.props;

    return (
      <Option
        key={option.name}
        option={option}
        value={element[option.name]}
        editMode={editMode}
        onChangeOption={(newValue) =>
          onChangeOption(element, elementType, option, newValue)
        }
        onBlurOption={() => onBlurOption(element, elementType, option)}
      />
    );
  }

  getConnectButton() {
    const { connectMode, onSwitchConnectMode } = this.props;

    if (connectMode) {
      return (
        <button
          className="col-sm btn btn-warning m-2"
          onClick={() => onSwitchConnectMode(false)}
        >
          Cancel connecting
        </button>
      );
    } else {
      return (
        <button
          className="col-sm btn btn-primary m-2"
          onClick={() => onSwitchConnectMode(true)}
        >
          Connect node
        </button>
      );
    }
  }

  getNodeName(nodeId) {
    const nodes = this.props.nodes;
    const node = nodes.find((node) => node.id === nodeId);

    if (node) {
      return node.name;
    } else {
      return "";
    }
  }

  getButtonsNodeConfig(selectedNode) {
    if (!this.props.editMode) {
      return;
    }

    return (
      <div className="form-group row m-2">
        {this.getConnectButton()}
        <button
          className="col-sm btn btn-danger m-2"
          onClick={() => this.props.onDeleteNode(selectedNode.id)}
        >
          Delete node
        </button>
      </div>
    );
  }

  getConfigSelectedNode(selectedNode, options) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">
          {selectedNode.type} <b>{selectedNode.name}</b>
        </h3>
        {options.map((option) =>
          this.getConfigOption(selectedNode, "nodes", option)
        )}
        {this.getButtonsNodeConfig(selectedNode)}
      </div>
    );
  }

  getButtonsSynapseConfig(selectedSynapse) {
    if (!this.props.editMode) {
      return;
    }

    return (
      <div className="form-group row m-2">
        <button
          className="col-sm btn btn-danger m-2"
          onClick={() => this.props.onDeleteSynapse(selectedSynapse.id)}
        >
          Delete synapse
        </button>
      </div>
    );
  }

  getConfigSelectedSynapse(selectedSynapse, options) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">
          Synapse from {this.getNodeName(selectedSynapse.pre)} to{" "}
          {this.getNodeName(selectedSynapse.post)}
        </h3>
        {options.map((option) =>
          this.getConfigOption(selectedSynapse, "synapses", option)
        )}
        {this.getButtonsSynapseConfig(selectedSynapse)}
      </div>
    );
  }

  getConfigSelectedElement(selectedNode, selectedSynapse) {
    if (selectedNode) {
      const options = allOptions[selectedNode.type];
      return this.getConfigSelectedNode(selectedNode, options);
    } else if (selectedSynapse) {
      const options = allOptions.options.synapse;
      return this.getConfigSelectedSynapse(selectedSynapse, options);
    }
  }

  render() {
    const { nodes, selectedNodeId, synapses, selectedSynapseId } = this.props;
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const selectedSynapse = synapses.find((s) => s.id === selectedSynapseId);

    return (
      <React.Fragment>
        {this.getConfigSelectedElement(selectedNode, selectedSynapse)}
      </React.Fragment>
    );
  }
}

export default ElementDetails;

import React, { Component } from "react";
import Option from "./Option";
import data from "../main/options.json";

// import options from options.json
const { options } = data;

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
          onClick={onSwitchConnectMode}
          title="ctrl+shift+c"
        >
          Cancel connecting
        </button>
      );
    } else {
      return (
        <button
          className="col-sm btn btn-primary m-2"
          onClick={onSwitchConnectMode}
          title="ctrl+shift+c"
        >
          Connect node
        </button>
      );
    }
  }

  getNodeName(nodeId) {
    const nodes = this.props.nodes;
    const node = nodes.find((node) => node.id === nodeId);

    // get name, check if node exists
    let name = node ? node.name : "";

    // return name, if empty return _
    return name === "" ? "_" : name;
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
          title="del"
        >
          Delete node
        </button>
      </div>
    );
  }

  getConfigSelectedNode(selectedNode, nodeOptions) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">
          {selectedNode.type} <b>{selectedNode.name}</b>
        </h3>
        {nodeOptions.map((option) =>
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
          title="del"
        >
          Delete synapse
        </button>
      </div>
    );
  }

  getConfigSelectedSynapse(selectedSynapse, synapseOptions) {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">
          Synapse from {this.getNodeName(selectedSynapse.pre)} to{" "}
          {this.getNodeName(selectedSynapse.post)}
        </h3>
        {synapseOptions.map((option) =>
          this.getConfigOption(selectedSynapse, "synapses", option)
        )}
        {this.getButtonsSynapseConfig(selectedSynapse)}
      </div>
    );
  }

  getNodeOptions(nodeType) {
    const optionalFeatures = this.props.optionalFeatures;
    const nodeOptions = Object.values(options.node);

    // only show options of type and not disabled optional features
    const filteredOptions = nodeOptions.filter((option) => {
      const disabled =
        option.name in optionalFeatures && !optionalFeatures[option.name];

      return !disabled && option.node_types.includes(nodeType);
    });

    return filteredOptions;
  }

  getConfigSelectedElement(selectedNode, selectedSynapse) {
    if (selectedNode) {
      const nodeOptions = this.getNodeOptions(selectedNode.type);
      return this.getConfigSelectedNode(selectedNode, nodeOptions);
    } else if (selectedSynapse) {
      const synapseOptions = Object.values(options.synapse);
      return this.getConfigSelectedSynapse(selectedSynapse, synapseOptions);
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

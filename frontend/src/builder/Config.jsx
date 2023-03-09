import React, { Component } from "react";
import Option from "./Option";

class Config extends Component {
  state = {
    lifOptions: {
      m: { type: "float", text: "Inverse leakage (m)" },
      V_init: { type: "float", text: "Initial voltage" },
      V_reset: { type: "float", text: "Reset voltage (R)" },
      thr: { type: "float", text: "Spiking threshold (T)" },
      I_e: { type: "float", text: "Constant input current" },
    },
    inputOptions: {
      train: { type: "float-list", text: "Input spike train" },
      loop: { type: "bool", text: "Whether to loop the train" },
    },
    synapseOptions: {
      w: { type: "float", text: "Synaptic weight" },
      d: { type: "int", text: "Synaptic delay in time steps" },
    },
  };

  getConfigOption(element, elementType, key, option) {
    const { onChangeOption } = this.props;

    return (
      <Option
        key={key}
        option={option}
        value={element[key]}
        onChangeOption={(newValue) =>
          onChangeOption(element, elementType, key, newValue)
        }
      />
    );
  }

  getConnectButton() {
    const { connectMode, onClickConnect, onClickCancelConnect } = this.props;

    if (connectMode) {
      return (
        <button className="btn btn-warning m-2" onClick={onClickCancelConnect}>
          Cancel connecting
        </button>
      );
    } else {
      return (
        <button className="btn btn-primary m-2" onClick={onClickConnect}>
          Connect node
        </button>
      );
    }
  }

  getConfigSelectedNode(selectedNode, options) {
    return (
      <React.Fragment>
        <h3>
          Editing {selectedNode.type} <b>{selectedNode.name}</b>
        </h3>
        {Object.keys(options).map((key) =>
          this.getConfigOption(selectedNode, "nodes", key, options[key])
        )}
        <br></br>
        {this.getConnectButton()}
        <button
          className="btn btn-danger m-2"
          onClick={() => this.props.onDeleteNode(selectedNode.id)}
        >
          Delete node
        </button>
      </React.Fragment>
    );
  }

  getConfigSelectedSynapse(selectedSynapse, options) {
    return (
      <React.Fragment>
        <h3>
          Editing synapse from {selectedSynapse.pre} to {selectedSynapse.post}
        </h3>
        {Object.keys(options).map((key) =>
          this.getConfigOption(selectedSynapse, "synapses", key, options[key])
        )}
        <button
          className="btn btn-danger m-2"
          onClick={() => this.props.onDeleteSynapse(selectedSynapse.id)}
        >
          Delete synapse
        </button>
      </React.Fragment>
    );
  }

  getConfigSelectedElement(selectedNode, selectedSynapse) {
    if (selectedNode) {
      const options =
        selectedNode.type === "lif"
          ? this.state.lifOptions
          : this.state.inputOptions;

      return this.getConfigSelectedNode(selectedNode, options);
    } else if (selectedSynapse) {
      const options = this.state.synapseOptions;
      return this.getConfigSelectedSynapse(selectedSynapse, options);
    }
  }

  render() {
    const { nodes, selectedNodeId, synapses, selectedSynapseId } = this.props;
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const selectedSynapse = synapses.find((s) => s.id === selectedSynapseId);

    return (
      <div className="column-right">
        {this.getConfigSelectedElement(selectedNode, selectedSynapse)}
      </div>
    );
  }
}

export default Config;

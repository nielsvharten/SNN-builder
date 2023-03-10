import React, { Component } from "react";
import Option from "./Option";

class Config extends Component {
  state = {
    lifOptions: [
      { name: "m", type: "float", text: "Inverse leakage (m)", default: 1 },
      { name: "V_init", type: "float", text: "Initial voltage", default: 0 },
      { name: "V_reset", type: "float", text: "Reset voltage (R)", default: 0 },
      { name: "thr", type: "float", text: "Spiking threshold (T)", default: 1 },
      {
        name: "I_e",
        type: "float",
        text: "Constant input current",
        default: 0,
      },
    ],
    inputOptions: [
      { name: "train", type: "float-list", text: "Input spike train" },
      { name: "loop", type: "bool", text: "Whether to loop the train" },
    ],
    synapseOptions: [
      { name: "w", type: "float", text: "Synaptic weight", default: 1 },
      {
        name: "d",
        type: "int",
        text: "Synaptic delay in time steps",
        default: 1,
      },
    ],
  };

  getConfigOption(element, elementType, option) {
    const { onChangeOption } = this.props;

    return (
      <Option
        key={option.name}
        option={option}
        value={element[option.name]}
        onChangeOption={(newValue) =>
          onChangeOption(element, elementType, option, newValue)
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

  getNodeName(nodeId) {
    const nodes = this.props.nodes;
    const node = nodes.find((node) => node.id === nodeId);

    if (node) {
      return node.name;
    } else {
      return "";
    }
  }

  getConfigSelectedNode(selectedNode, options) {
    return (
      <React.Fragment>
        <h3>
          Editing {selectedNode.type} <b>{selectedNode.name}</b>
        </h3>
        {options.map((option) =>
          this.getConfigOption(selectedNode, "nodes", option)
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
          Editing synapse from {this.getNodeName(selectedSynapse.pre)} to{" "}
          {this.getNodeName(selectedSynapse.post)}
        </h3>
        {options.map((option) =>
          this.getConfigOption(selectedSynapse, "synapses", option)
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

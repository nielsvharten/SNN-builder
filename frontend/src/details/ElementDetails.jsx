import React, { Component } from "react";
import Option from "./Option";
import Plot from "./Plot";

class ElementDetails extends Component {
  state = {
    options: {
      lif: [
        {
          name: "m",
          type: "float",
          text: "Inverse leakage (m)",
          default: 1,
          min: 0,
          max: 1,
        },
        {
          name: "V_init",
          type: "float",
          text: "Initial voltage",
          default: 0,
          min: 0,
        },
        {
          name: "V_reset",
          type: "float",
          text: "Reset voltage (R)",
          default: 0,
          min: 0,
        },
        {
          name: "thr",
          type: "float",
          text: "Spiking threshold (T)",
          default: 1,
        },
        {
          name: "I_e",
          type: "float",
          text: "Constant input current",
          default: 0,
        },
        { name: "read_out", type: "bool", text: "Read-out neuron" },
      ],
      input: [
        { name: "train", type: "float-list", text: "Input spike train" },
        { name: "loop", type: "bool", text: "Whether to loop the train" },
      ],
      random: [
        {
          name: "p",
          type: "float",
          text: "Spiking probability",
          min: 0,
          max: 1,
        },
      ],
      synapse: [
        { name: "w", type: "float", text: "Synaptic weight", default: 1 },
        {
          name: "d",
          type: "int",
          text: "Synaptic delay in time steps",
          default: 1,
          min: 1,
        },
      ],
    },
  };

  getConfigOption(element, elementType, option) {
    const { editMode, onChangeOption } = this.props;

    return (
      <Option
        key={option.name}
        option={option}
        value={element[option.name]}
        editMode={editMode}
        onChangeOption={(newValue) =>
          onChangeOption(element, elementType, option, newValue)
        }
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
      const options = this.state.options[selectedNode.type];
      return this.getConfigSelectedNode(selectedNode, options);
    } else if (selectedSynapse) {
      const options = this.state.options.synapse;
      return this.getConfigSelectedSynapse(selectedSynapse, options);
    }
  }

  getPlotsSelectedNode(selectedNode, measurements) {
    if (selectedNode && measurements[selectedNode.id]) {
      return (
        <Plot
          voltages={measurements[selectedNode.id]["voltages"]}
          spikes={measurements[selectedNode.id]["spikes"]}
        />
      );
    }
  }

  render() {
    const { nodes, measurements, selectedNodeId, synapses, selectedSynapseId } =
      this.props;
    const selectedNode = nodes.find((n) => n.id === selectedNodeId);
    const selectedSynapse = synapses.find((s) => s.id === selectedSynapseId);

    return (
      <React.Fragment>
        {this.getConfigSelectedElement(selectedNode, selectedSynapse)}
        <br />
        {this.getPlotsSelectedNode(selectedNode, measurements)}
      </React.Fragment>
    );
  }
}

export default ElementDetails;

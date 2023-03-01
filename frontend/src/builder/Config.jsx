import React, { Component } from "react";

class Config extends Component {
  state = {
    lifOptions: {
      m: "Inverse leakage (m)",
      V_init: "Initial voltage",
      V_reset: "Reset voltage (R)",
      thr: "Spiking threshold (T)",
      I_e: "Constant input current",
    },
    inputOptions: {
      train: "Input spike train",
      loop: "Whether to loop the train",
    },
    synapseOptions: {
      w: "Synaptic weight",
      d: "Synaptic delay in time steps",
    },
  };

  getConfigOption(element, elementType, key, label) {
    const { onChangeOption } = this.props;

    return (
      <div className="form-group row m-1" key={key}>
        <div className="col-sm-5">
          <label className="col-form-label">{label}</label>
        </div>
        <div className="col-sm-3">
          <input
            className="form-control"
            value={element[key]}
            onChange={(e) =>
              onChangeOption(element, elementType, key, e.target.value)
            }
          ></input>
        </div>
      </div>
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
          Editing {selectedNode.type} {selectedNode.name}
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
      <div className="column">
        {this.getConfigSelectedElement(selectedNode, selectedSynapse)}
      </div>
    );
  }
}

export default Config;

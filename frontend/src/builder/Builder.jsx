import React, { Component } from "react";
import Network from "./Network";
import Config from "./Config";

class Builder extends Component {
  state = {
    maxNodeId: 0,
    maxSynapseId: 0,
    selectedNodeId: null,
    selectedSynapseId: null,
    connectMode: false,
    network: {
      id: 1,
      name: "",
      nodes: [],
      synapses: [],
    },
  };

  handleSaveNetwork = () => {
    console.log("save state", this.state);

    const jsonState = JSON.stringify(this.state);
    window.localStorage.setItem("state", jsonState);
  };

  handleAddSynapse = (preId, postId) => {
    console.log("create", preId, postId);
    const network = { ...this.state.network };
    const id = this.state.maxSynapseId + 1;

    const synapse = {
      id: id,
      pre: preId,
      post: postId,
      w: 1.0,
      d: 1,
    };

    network.synapses = network.synapses.concat(synapse);
    this.setState({ maxSynapseId: id });
    this.setState({ network });
  };

  handleSelectSynapse = (synapseId) => {
    const selectedSynapseId = synapseId;
    const selectedNodeId = null;

    // select node and deselect previous selected node
    this.setState({ selectedSynapseId });
    this.setState({ selectedNodeId });
  };

  handleClickSynapse = (synapseId) => {
    this.handleSelectSynapse(synapseId);
  };

  handleDeleteSynapse = () => {};

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const id = this.state.maxNodeId + 1;

    const node = {
      id: id,
      type: type,
      name: "",
      x_pos: 100,
      y_pos: 100,
    };

    if (type === "lif") {
      node.m = 0.0;
      node.V_init = 0.0;
      node.V_reset = 0.0;
      node.thr = 0.99;
      node.I_e = 0.0;
    } else if (type === "input") {
      node.train = "[0]";
      node.loop = false;
    }

    network.nodes = network.nodes.concat(node);

    this.setState({ maxNodeId: id });
    this.setState({ network });
  };

  handleDeleteNode = (nodeId) => {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((node) => node.id !== nodeId);
    network.synapses = network.synapses.filter(
      (synapse) => synapse.pre !== nodeId && synapse.post !== nodeId
    );

    this.setState({ network });
  };

  handleStopDragNode = (node, x, y) => {
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index].x_pos = x;
    network.nodes[index].y_pos = y;

    this.setState({ network });
  };

  handleSelectNode = (nodeId) => {
    const selectedNodeId = nodeId;
    const selectedSynapseId = null;

    // select node and deselect previous selected node
    this.setState({ selectedNodeId });
    this.setState({ selectedSynapseId });
  };

  handleClickNode = (node) => {
    const { connectMode, selectedNodeId } = this.state;

    if (connectMode) {
      if (node.type === "input") {
        return;
      }
      this.handleAddSynapse(selectedNodeId, node.id);

      // disable connect mode
      this.handleSwitchConnectMode(false);
    } else {
      this.handleSelectNode(node.id);
    }
  };

  handleRenameNode = (node, newName) => {
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index].name = newName;

    this.setState({ network });
  };

  handleChangeOption = (node, option, newValue) => {
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index][option] = newValue;

    this.setState({ network });
  };

  handleSwitchConnectMode = (connectMode) => {
    this.setState({ connectMode });
  };

  componentDidMount() {
    const jsonState = window.localStorage.getItem("state");
    if (jsonState === null) {
      console.log("no state defined");
      return;
    }

    const state = JSON.parse(jsonState);
    this.setState(state);
  }

  render() {
    const { selectedNodeId, selectedSynapseId, network } = this.state;

    return (
      <React.Fragment>
        <div className="builder">
          <Network
            network={network}
            selectedNodeId={selectedNodeId}
            onStopDragNode={this.handleStopDragNode}
            onClickNode={this.handleClickNode}
            onRenameNode={this.handleRenameNode}
            selectedSynapseId={selectedSynapseId}
            onClickSynapse={this.handleClickSynapse}
          />
          <Config
            nodes={network.nodes}
            connectMode={this.state.connectMode}
            onChangeOption={this.handleChangeOption}
            onDeleteNode={this.handleDeleteNode}
            onClickConnect={() => this.handleSwitchConnectMode(true)}
            onClickCancelConnect={() => this.handleSwitchConnectMode(false)}
            selectedNodeId={selectedNodeId}
          />
        </div>
        <button
          onClick={() => this.handleAddNode("lif")}
          className="btn btn-primary m-2"
        >
          Add lif
        </button>
        <button
          onClick={() => this.handleAddNode("input")}
          className="btn btn-warning m-2"
        >
          Add input
        </button>
        <button
          onClick={this.handleSaveNetwork}
          className="btn btn-success m-2"
        >
          Save network
        </button>
      </React.Fragment>
    );
  }
}

export default Builder;

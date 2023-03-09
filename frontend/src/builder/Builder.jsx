import React, { Component } from "react";
import Network from "./Network";
import Config from "./Config";
import APIService from "./APIService";

class Builder extends Component {
  state = {
    selectedNodeId: null,
    selectedSynapseId: null,
    connectMode: false,
    loaded: false,
    network: {
      id: 1,
      name: "",
      nodes: [],
      synapses: [],
      maxNodeId: 0,
      maxSynapseId: 0,
    },
  };

  handleSaveNetwork = () => {
    console.log("save network", this.state.network);

    this.handlePostNetwork();

    const jsonState = JSON.stringify(this.state.network);
    window.localStorage.setItem("network", jsonState);
  };

  handlePostNetwork = () => {
    const network = this.state.network;
    network.nodes = [...network.nodes];

    fetch("http://127.0.0.1:5000/network", {
      method: "POST",
      //headers: { "X-CSRFToken": getCookie("csrftoken") },
      headers: {
        "Access-Control-Allow-Origin": "localhost:5000",
        "Content-Type": "application/json",
      },
      //credentials: "include",
      body: JSON.stringify(this.state.network),
    })
      .then()
      .catch();
  };

  handleAddSynapse = (preId, postId) => {
    console.log("create", preId, postId);
    const network = { ...this.state.network };
    const id = network.maxSynapseId + 1;

    const synapse = {
      id: id,
      pre: preId,
      post: postId,
      w: 1.0,
      d: 1,
    };

    network.synapses = network.synapses.concat(synapse);
    network.maxSynapseId = id;

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

  handleDeleteSynapse = (synapseId) => {
    const network = { ...this.state.network };
    network.synapses = network.synapses.filter((s) => s.id !== synapseId);
    console.log(synapseId);
    this.setState({ network });
  };

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const id = network.maxNodeId + 1;

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
    network.maxNodeId = id;

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

  handleChangeOption = (element, elementType, option, newValue) => {
    // TODO: check if input is valid
    const network = { ...this.state.network };
    const index = network[elementType].indexOf(element);
    network[elementType][index] = { ...element };
    network[elementType][index][option] = newValue;

    this.setState({ network });
  };

  handleSwitchConnectMode = (connectMode) => {
    this.setState({ connectMode });
  };

  rerenderSynapses = () => {
    console.log("rerendering synapses");
    const network = { ...this.state.network };
    network.synapses = [...this.state.network.synapses];

    this.setState({ network });
  };

  componentDidMount() {
    const jsonState = window.localStorage.getItem("network");
    if (jsonState === null) {
      console.log("no network defined");
      this.setState({ loaded: true });
      return;
    }

    const network = JSON.parse(jsonState);
    this.setState({ network, loaded: true });
  }

  getBuilder() {
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
            rerenderSynapses={this.rerenderSynapses}
          />
          <Config
            nodes={network.nodes}
            selectedNodeId={selectedNodeId}
            synapses={network.synapses}
            selectedSynapseId={selectedSynapseId}
            connectMode={this.state.connectMode}
            onChangeOption={this.handleChangeOption}
            onDeleteNode={this.handleDeleteNode}
            onClickConnect={() => this.handleSwitchConnectMode(true)}
            onClickCancelConnect={() => this.handleSwitchConnectMode(false)}
            onDeleteSynapse={this.handleDeleteSynapse}
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

  render() {
    if (this.state.loaded) {
      return this.getBuilder();
    }
  }
}

export default Builder;

import React, { Component } from "react";
import Network from "./Network";
import Config from "./Config";

class Builder extends Component {
  state = {
    maxId: 0,
    network: {
      id: -1,
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

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const id = this.state.maxId + 1;

    const node = {
      id: id,
      type: type,
      name: "",
      x_pos: 100,
      y_pos: 100,
      selected: false,
      m: 0.0,
    };

    if (type === "lif") {
      // TODO:
    }
    network.nodes = network.nodes.concat(node);

    this.setState({ maxId: id });
    this.setState({ network });
  };

  handleDeleteNode(nodeId) {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((node) => node.id !== nodeId);
    //network.synapses = network.synapses.filter(s => )

    this.setState({ network });
  }

  handleStopDragNode = (node, x, y) => {
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index].x_pos = x;
    network.nodes[index].y_pos = y;

    this.setState({ network });
  };

  handleClickNode = (node) => {
    const network = { ...this.state.network };
    const indexNew = network.nodes.indexOf(node);
    const indexPrev = network.nodes.indexOf(
      network.nodes.find((node) => node.selected === true)
    );

    // deselect previous selected node
    network.nodes[indexPrev] = { ...network.nodes[indexPrev] };
    network.nodes[indexPrev].selected = false;

    // select node
    network.nodes[indexNew] = { ...node };
    network.nodes[indexNew].selected = true;

    this.setState({ network });
  };

  handleRenameNode = (node, newName) => {
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index].name = newName;

    this.setState({ network });
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
    const { error, isLoaded, network } = this.state;

    return (
      <React.Fragment>
        <Network
          network={network}
          onStopDragNode={this.handleStopDragNode}
          onClickNode={this.handleClickNode}
          onRenameNode={this.handleRenameNode}
        />
        <Config nodes={network.nodes} />
        <button
          onClick={() => this.handleAddNode("lif")}
          className="btn btn-primary m-2"
        >
          ADD LIF
        </button>
        <button
          onClick={() => this.handleAddNode("input")}
          className="btn btn-warning m-2"
        >
          ADD INPUT
        </button>
        <button
          onClick={this.handleSaveNetwork}
          className="btn btn-success m-2"
        >
          SAVE NETWORK
        </button>
      </React.Fragment>
    );
  }
}

export default Builder;

import React, { Component } from "react";
import Network from "./Network";

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

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const id = this.state.maxId + 1;

    const node = {
      id: id,
      type: type,
      name: "",
      x_pos: 100,
      y_pos: 100,
      m: 0.0,
    };

    if (type === "lif") {
      // TODO:
    }
    network.nodes = network.nodes.concat(node);

    this.setState({ maxId: id });
    this.setState({ network });
  };

  handleSaveNetwork = () => {
    console.log("save state", this.state);

    const jsonState = JSON.stringify(this.state);
    window.localStorage.setItem("state", jsonState);
  };

  handleDeleteNode(nodeId) {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((node) => node.id !== nodeId);
    //network.synapses = network.synapses.filter(s => )

    this.setState({ network });
  }

  handleStopDragNode = (node, x, y) => {
    console.log("Node dragged", node);
    console.log(x, y);
    const network = { ...this.state.network };
    const index = network.nodes.indexOf(node);
    network.nodes[index] = { ...node };
    network.nodes[index].x_pos = x;
    network.nodes[index].y_pos = y;

    // disable transform before setting correct state?
    this.setState({ network });
  };

  handleClickNode = (nodeId) => {
    console.log("Node clicked", nodeId);
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
        />
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

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
      x_pos: "100px",
      y_pos: "100px",
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

  handleDeleteNode(node) {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((n) => n !== node);
    //network.synapses = network.synapses.filter(s => )

    this.setState({ network });
  }

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
        <Network network={network} />
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

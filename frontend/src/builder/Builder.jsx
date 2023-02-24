import React, { Component } from "react";
import Network from "./Network";

class Builder extends Component {
  state = {
    error: null,
    isLoaded: false,
    network: {
      id: -1,
      name: "",
      nodes: [],
      synapses: [],
    },
  };

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const node = {
      id: 124,
      type: type,
      name: "A",
      x_pos: "100px",
      y_pos: "100px",
      m: 0.0,
    };

    if (type === "lif") {
      // TODO:
    }
    network.nodes = network.nodes.concat(node);

    this.setState({ network });
  };

  handleSaveNetwork = () => {
    console.log("save network", this.state.network);

    const jsonNetwork = JSON.stringify(this.state.network);
    window.localStorage.setItem("network", jsonNetwork);
    /*
    var data = new FormData();
    data.append("network", this.state.network);
    console.log(JSON.stringify(this.state.network));
    fetch("http://127.0.0.1:8000/api/networks/1/", {
      method: "PATCH",
      //headers: { "X-CSRFToken": getCookie("csrftoken") }
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.network),
      //credentials: "include",
    });*/
  };

  handleDeleteNode(node) {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((n) => n !== node);
    //network.synapses = network.synapses.filter(s => )

    this.setState({ network });
  }

  componentDidMount() {
    const jsonNetwork = window.localStorage.getItem("network");
    const network = JSON.parse(jsonNetwork);

    this.setState({ network });
    /*
    fetch("http://127.0.0.1:8000/api/networks/1/")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            network: result,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );*/
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

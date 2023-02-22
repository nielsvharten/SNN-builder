import React, { Component } from "react";
import Network from "./Network";

class Builder extends Component {
  state = {
    error: null,
    isLoaded: false,
    network: {
      id: -1,
      name: "",
      lifs: [],
      input_trains: [],
      synapses: [],
    },
  };

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const node = { id: -1, name: "", x_pos: "100px", y_pos: "100px" };

    if (type === "lif") {
      network.lifs = network.lifs.concat(node);
    } else if (type === "input-train") {
      network.input_trains = network.input_trains.concat(node);
    }

    this.setState({ network });
  };

  handleSaveNetwork = () => {
    console.log("save network", this.state.network);

    var data = new FormData();
    data.append("lifs", this.state.network.lifs);
    data.append("input_trains", this.state.network.input_trains);

    fetch("http://127.0.0.1:8000/api/v1/questions/", {
      method: "POST",
      //headers: { "X-CSRFToken": getCookie("csrftoken") },
      body: data,
      //credentials: "include",
    });
  };

  handleDeleteNode(node) {
    const network = { ...this.state.network };
    network.lifs = network.lifs.filter((l) => l !== node);
    network.input_trains = network.input_trains.filter((i) => i !== node);
    //network.synapses = network.synapses.filter(s => )

    this.setState({ network });
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8000/api/v1/questions/")
      .then((res) => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            network: result[0],
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        }
      );
  }

  render() {
    const { error, isLoaded, network } = this.state;

    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>...</div>;
    } else {
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
            onClick={() => this.handleAddNode("input-train")}
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
}

export default Builder;

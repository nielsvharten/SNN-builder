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
      inputTrains: [],
      synapses: [],
    },
  };

  handleDeleteNode() {}

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
      return <div>Loading...</div>;
    } else {
      return <Network network={network} />;
    }
  }
}

export default Builder;

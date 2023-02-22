import React, { Component } from "react";
import Node from "./Node";

class Network extends Component {
  handleDragNode(nodeId) {
    console.log("Node dragged", nodeId);
  }

  handleClickNode(nodeId) {
    console.log("Node clicked", nodeId);
  }

  render() {
    const { id, name, lifs, input_trains, synapses } = this.props.network;

    return (
      <div className="network">
        {lifs.map((lif) => (
          <Node
            key={lif.id}
            type="lif"
            node={lif}
            onDragNode={() => this.handleDragNode(lif.id)}
            onClickNode={() => this.handleClickNode(lif.id)}
          />
        ))}
        {input_trains.map((input) => (
          <Node
            key={input.id}
            type="input-train"
            node={input}
            onDragNode={() => this.handleDragNode(input.id)}
            onClickNode={() => this.handleClickNode(input.id)}
          />
        ))}
      </div>
    );
  }
}

export default Network;

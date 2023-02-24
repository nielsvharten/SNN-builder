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
    const { id, name, nodes, synapses } = this.props.network;

    return (
      <div className="network">
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onDragNode={() => this.handleDragNode(node.id)}
            onClickNode={() => this.handleClickNode(node.id)}
          />
        ))}
      </div>
    );
  }
}

export default Network;

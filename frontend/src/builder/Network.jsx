import React, { Component } from "react";
import Node from "./Node";

class Network extends Component {
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
            onStopDragNode={this.props.onStopDragNode}
            onClickNode={() => this.props.onClickNode(node.id)}
          />
        ))}
      </div>
    );
  }
}

export default Network;

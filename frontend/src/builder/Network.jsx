import React, { Component } from "react";
import Node from "./Node";

class Network extends Component {
  render() {
    const { id, name, nodes, synapses } = this.props.network;

    return (
      <div className="network column">
        {nodes.map((node) => (
          <Node
            key={node.id}
            node={node}
            onStopDragNode={this.props.onStopDragNode}
            onClickNode={this.props.onClickNode}
            onRenameNode={this.props.onRenameNode}
          />
        ))}
      </div>
    );
  }
}

export default Network;

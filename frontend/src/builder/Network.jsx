import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import Node from "./Node";
import Synapse from "./Synapse";

class Network extends Component {
  state = {
    storedNodes: [...this.props.network.nodes],
  };

  handleArrowClick = (e) => {
    console.log("xarrow clicked!");
    console.log(e);
  };

  getStoredName(nodeId) {
    const storedNode = this.state.storedNodes.find(
      (node) => node.id === nodeId
    );

    return storedNode ? storedNode.name : "";
  }

  getNodeComponents(nodes) {
    const { onStopDragNode, onClickNode, onRenameNode, selectedNodeId } =
      this.props;

    return nodes.map((node) => (
      <Node
        key={node.id}
        node={node}
        storedName={this.getStoredName(node.id)}
        onStopDragNode={onStopDragNode}
        onClickNode={onClickNode}
        onRenameNode={onRenameNode}
        selectedNodeId={selectedNodeId}
      />
    ));
  }

  getSynapseComponents(synapses) {
    return synapses.map((synapse) => (
      <Synapse
        key={synapse.id}
        synapse={synapse}
        selectedSynapseId={this.props.selectedSynapseId}
        onClickSynapse={this.props.onClickSynapse}
      />
    ));
  }

  render() {
    const { id, name, nodes, synapses } = this.props.network;

    return (
      <div className="network column">
        <Xwrapper style={{ width: "100%", height: "100%" }}>
          {this.getNodeComponents(nodes)}
          {this.getSynapseComponents(synapses)}
        </Xwrapper>
      </div>
    );
  }
}

export default Network;

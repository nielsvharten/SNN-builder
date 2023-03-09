import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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

  getMinNetworkWidth = () => {
    const xPositionNodes = this.props.network.nodes.map((node) => node.x_pos);
    const width = Math.max(...xPositionNodes);

    return (width + 200).toString() + "px";
  };

  getMinNetworkHeight = () => {
    const xPositionNodes = this.props.network.nodes.map((node) => node.y_pos);
    const height = Math.max(...xPositionNodes);

    return (height + 200).toString() + "px";
  };

  printStuff = () => {
    this.props.rerenderSynapses();
    console.log("rerender now!");
  };

  render() {
    const { id, name, nodes, synapses } = this.props.network;

    return (
      <Xwrapper>
        <TransformWrapper
          //maxScale={1}
          minScale={0.2}
          panning={{ excluded: ["node-lif", "node-input", "node-name"] }}
          onTransformed={this.printStuff}
        >
          <TransformComponent>
            <div
              className="network column-left"
              style={{
                minWidth: this.getMinNetworkWidth(),
                minHeight: this.getMinNetworkHeight(),
              }}
            >
              {this.getNodeComponents(nodes)}
            </div>
          </TransformComponent>
        </TransformWrapper>
        {this.getSynapseComponents(synapses)}
      </Xwrapper>
    );
  }
}

export default Network;

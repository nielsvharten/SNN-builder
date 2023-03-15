import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Node from "./Node";
import Synapse from "./Synapse";

class Network extends Component {
  state = {
    storedNodes: [...this.props.network.nodes],
  };

  getStoredName(nodeId) {
    const storedNode = this.state.storedNodes.find(
      (node) => node.id === nodeId
    );

    return storedNode ? storedNode.name : "";
  }

  getNodeVoltage(node, execution) {
    if (execution.measurements[node.id]) {
      return execution.measurements[node.id]["voltages"][execution.timeStep];
    }

    return null;
  }

  getNodeSpike(node, execution) {
    if (execution.measurements[node.id]) {
      return execution.measurements[node.id]["spikes"][execution.timeStep];
    }

    return false;
  }

  getNodeComponents(nodes) {
    const {
      onStopDragNode,
      onClickNode,
      onRenameNode,
      selectedNodeId,
      execution,
    } = this.props;

    return nodes.map((node) => (
      <Node
        key={node.id}
        node={node}
        editMode={this.props.editMode}
        voltage={this.getNodeVoltage(node, execution)}
        spike={this.getNodeSpike(node, execution)}
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
    const xPositionNodes = this.props.network.nodes.map((node) => node.x);
    const width = Math.max(...xPositionNodes);

    return (width + 200).toString() + "px";
  };

  getMinNetworkHeight = () => {
    const xPositionNodes = this.props.network.nodes.map((node) => node.y);
    const height = Math.max(...xPositionNodes);

    return (height + 200).toString() + "px";
  };

  getBackgroundColor = () => {
    if (this.props.editMode) {
      return "rgb(160, 160, 160)";
    } else {
      return "rgb(117, 117, 117)";
    }
  };
  render() {
    const { id, name, nodes, synapses } = this.props.network;

    return (
      <TransformWrapper
        maxScale={1}
        panning={{
          excluded: ["node-lif", "node-input", "node-name", "node-prop"],
        }}
      >
        <TransformComponent>
          <div
            className="network column-left"
            style={{
              minWidth: this.getMinNetworkWidth(),
              minHeight: this.getMinNetworkHeight(),
              backgroundColor: this.getBackgroundColor(),
            }}
          >
            <Xwrapper>
              {this.getNodeComponents(nodes)}
              {this.getSynapseComponents(synapses)}
            </Xwrapper>
          </div>
        </TransformComponent>
      </TransformWrapper>
    );
  }
}

export default Network;

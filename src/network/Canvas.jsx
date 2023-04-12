import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Node from "./Node";
import Connection from "./Connection";

class Canvas extends Component {
  state = { loops: {} };

  getNodeVoltage(node, execution) {
    if (execution && execution.measurements[node.id]) {
      return execution.measurements[node.id]["voltages"][execution.timeStep];
    }

    return null;
  }

  getNodeSpike(node, execution) {
    if (execution && execution.measurements[node.id]) {
      return execution.measurements[node.id]["spikes"][execution.timeStep];
    }

    return false;
  }

  getNodeComponents(nodes) {
    const {
      selectedNodeId,
      execution,
      editMode,
      onDragNode,
      onStopDragNode,
      onClickNode,
      onRenameNode,
    } = this.props;

    return nodes.map((node) => (
      <Node
        key={node.id}
        node={node}
        selected={selectedNodeId === node.id}
        editMode={editMode}
        voltage={this.getNodeVoltage(node, execution)}
        spike={this.getNodeSpike(node, execution)}
        // handlers
        onDragNode={onDragNode}
        onStopDragNode={onStopDragNode}
        onClickNode={onClickNode}
        onRenameNode={onRenameNode}
      />
    ));
  }

  getSynapseComponents(nodes, synapses) {
    const connections = {};
    synapses.forEach((synapse) => {
      // does connection from pre to post exist?
      if (connections[[synapse.pre, synapse.post]]) {
        // yes, add to list
        connections[[synapse.pre, synapse.post]].push(synapse);
      } else {
        // no, initialize new list with synapse
        connections[[synapse.pre, synapse.post]] = [synapse];
      }
    });

    return Object.entries(connections).map(([id, synapses]) => (
      <Connection
        key={id}
        preNode={nodes.find((node) => node.id === synapses[0].pre)}
        synapses={synapses}
        selectedSynapseId={this.props.selectedSynapseId}
        // handlers
        onClickSynapse={this.props.onClickSynapse}
      />
    ));
  }

  getMinNetworkWidth = () => {
    const xPositionNodes = this.props.network.nodes.map((node) => node.x);
    const width = Math.max(...xPositionNodes);

    return (width + 400).toString() + "px";
  };

  getMinNetworkHeight = () => {
    const xPositionNodes = this.props.network.nodes.map((node) => node.y);
    const height = Math.max(...xPositionNodes);

    return (height + 400).toString() + "px";
  };

  getBackgroundColor = () => {
    if (this.props.editMode) {
      return "rgb(160, 160, 160)";
    } else {
      return "rgb(117, 117, 117)";
    }
  };

  handleRemoveSelection = (e) => {
    const { connectMode, onDeselectElement } = this.props;

    if (!e.target.classList.value.includes("node-name")) {
      document.activeElement.blur();
    }

    if (!connectMode && e.target.classList.value.includes("canvas")) {
      onDeselectElement();
    }
  };

  render() {
    const { nodes, synapses } = this.props.network;

    return (
      <TransformWrapper
        maxScale={1}
        panning={{
          excluded: [
            "node-wrapper",
            "node-cut-off",
            "node-shape",
            "node-prop",
            "node-name",
          ],
        }}
      >
        <TransformComponent>
          <div
            className="canvas"
            style={{
              minWidth: this.getMinNetworkWidth(),
              minHeight: this.getMinNetworkHeight(),
              backgroundColor: this.getBackgroundColor(),
            }}
            onClick={this.handleRemoveSelection}
          >
            <Xwrapper>
              {this.getNodeComponents(nodes)}
              {this.getSynapseComponents(nodes, synapses)}
            </Xwrapper>
          </div>
        </TransformComponent>
      </TransformWrapper>
    );
  }
}

export default Canvas;

import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ContextMenu from "./ContextMenu";
import Node from "./Node";
import Synapse from "./Synapse";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  useContextMenu,
} from "react-contexify";

class Network extends Component {
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
      selectedNodeId,
      execution,
      editMode,
      onStartDragNode,
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
        onStartDragNode={onStartDragNode}
        onStopDragNode={onStopDragNode}
        onClickNode={onClickNode}
        onRenameNode={onRenameNode}
      />
    ));
  }

  getSynapseComponents(synapses) {
    return synapses.map((synapse) => (
      <Synapse
        key={synapse.id}
        synapse={synapse}
        selected={this.props.selectedSynapseId === synapse.id}
        // handlers
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

  displayMenu = (e) => {
    const className = e.target.className;

    let id = "";
    if (className.includes("column-left")) {
      id = "menu-bg";
    } else if (className.includes("node-shape")) {
      id = "menu-node";
    }

    const { show } = useContextMenu({
      id: id,
    });

    show({
      event: e,
    });
  };

  handleRemoveSelection = (e) => {
    const { connectMode, onDeselectElements } = this.props;

    if (!e.target.classList.value.includes("node-name")) {
      document.activeElement.blur();
    }

    if (!connectMode && e.target.classList.value.includes("column-left")) {
      onDeselectElements();
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
            "node-name",
            "node-prop",
          ],
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
            onClick={this.handleRemoveSelection}
            onContextMenu={this.displayMenu}
          >
            <ContextMenu />
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

import React, { Component } from "react";
import { Xwrapper } from "react-xarrows";
import Node from "./Node";
import Synapse from "./Synapse";

class Network extends Component {
  state = {
    rendered: false,
  };

  handleArrowClick = (e) => {
    console.log("xarrow clicked!");
    console.log(e);
  };

  componentDidMount() {
    const rendered = true;
    this.setState({ rendered });
  }

  getNodeComponents(nodes) {
    const { onStopDragNode, onClickNode, onRenameNode, selectedNodeId } =
      this.props;

    return nodes.map((node) => (
      <Node
        key={node.id}
        node={node}
        onStopDragNode={onStopDragNode}
        onClickNode={onClickNode}
        onRenameNode={onRenameNode}
        selectedNodeId={selectedNodeId}
      />
    ));
  }

  getSynapseComponents(synapses) {
    if (!this.state.rendered) {
      return;
    }

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

import React, { Component } from "react";
import Node from "./Node";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import Draggable from "react-draggable";

const boxStyle = {
  border: "grey solid 2px",
  borderRadius: "10px",
  padding: "5px",
};

const DraggableBox = ({ id }) => {
  const updateXarrow = useXarrow();
  return (
    <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
      <div id={id} style={boxStyle}>
        {id}
      </div>
    </Draggable>
  );
};

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
        <div>
          <Xwrapper>
            <DraggableBox id={"elem1"} />
            <DraggableBox id={"elem2"} />
            <Xarrow start={"elem1"} end="elem2" />
          </Xwrapper>
        </div>
      </div>
    );
  }
}

export default Network;

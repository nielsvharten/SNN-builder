import React, { Component } from "react";
import Draggable from "react-draggable"; // The default

class Node extends Component {
  render() {
    const { node, onDragNode, onClickNode } = this.props;

    return (
      <Draggable
        position={{ x: node.x_pos, y: node.y_pos }}
        bounds={"parent"}
        onStop={(_, data) => this.props.onStopDragNode(node, data.x, data.y)}
      >
        <div className={"node node-" + node.type} onClick={onClickNode}>
          <div className="node-name" contentEditable="true" spellCheck="false">
            {node.name}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default Node;

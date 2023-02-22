import React, { Component } from "react";
import Draggable from "react-draggable"; // The default

class Node extends Component {
  render() {
    const { node, type, onDragNode, onClickNode } = this.props;

    return (
      <Draggable onStart={onClickNode} onDrag={onDragNode}>
        <div
          className={"node node-" + type}
          onClick={onClickNode}
          style={{ top: node.y_pos, left: node.x_pos }}
        >
          <div className="node-name" contentEditable="true" spellCheck="false">
            {node.name}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default Node;

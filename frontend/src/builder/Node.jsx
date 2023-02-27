import React, { Component } from "react";
import Draggable from "react-draggable"; // The default

class Node extends Component {
  state = {
    storedName: this.props.node.name,
  };

  render() {
    const { node, onStopDragNode, onClickNode, onRenameNode } = this.props;

    let selectedClass = node.selected === true ? " selected" : "";

    return (
      <Draggable
        position={{ x: node.x_pos, y: node.y_pos }}
        bounds={"parent"}
        onStop={(_, data) => onStopDragNode(node, data.x, data.y)}
      >
        <div
          className={"node node-" + node.type + selectedClass}
          onClick={() => onClickNode(node)}
        >
          <div
            className="node-name"
            contentEditable="true"
            spellCheck="false"
            onInput={(e) => onRenameNode(node, e.currentTarget.textContent)}
          >
            {this.state.storedName}
          </div>
        </div>
      </Draggable>
    );
  }
}

export default Node;

import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

const Node = ({
  node,
  selectedNodeId,
  onStopDragNode,
  onClickNode,
  onRenameNode,
  storedName,
}) => {
  const updateXarrow = useXarrow();
  let selectedClass = node.id === selectedNodeId ? " selected" : "";

  return (
    <Draggable
      onStart={() => onClickNode(node)}
      onDrag={updateXarrow}
      onStop={(_, data) => onStopDragNode(node, data.x, data.y)}
      position={{ x: node.x_pos, y: node.y_pos }}
      bounds={"parent"}
    >
      <div
        id={node.id}
        className={"node node-" + node.type + selectedClass}
        onClick={() => onClickNode(node)}
      >
        <div
          className="node-name"
          contentEditable="true"
          spellCheck="false"
          onInput={(e) => onRenameNode(node, e.currentTarget.textContent)}
        >
          {storedName}
        </div>
      </div>
    </Draggable>
  );
};

export default Node;

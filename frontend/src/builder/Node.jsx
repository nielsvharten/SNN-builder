import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

function getNodeProps(node) {
  if (node.type !== "lif") {
    return;
  }

  return (
    <React.Fragment>
      <div
        className="node-prop node-prop-m"
        style={{
          position: "absolute",
          top: "-10px",
          left: "50px",
          fontSize: "small",
        }}
      >
        m={node.m}
      </div>
      <div
        className="node-prop node-prop-thr"
        style={{
          position: "absolute",
          top: "50px",
          left: "50px",
          fontSize: "small",
        }}
      >
        T={node.thr}
      </div>
    </React.Fragment>
  );
}

const Node = ({
  node,
  selectedNodeId,
  onStopDragNode,
  onClickNode,
  onRenameNode,
  storedName,
}) => {
  const updateXarrow = useXarrow();
  const selectedClass = node.id === selectedNodeId ? " selected" : "";
  const readOutClass = node.read_out ? " read-out" : "";

  return (
    <Draggable
      onStart={() => onClickNode(node)}
      onDrag={updateXarrow}
      onStop={(_, data) => onStopDragNode(node, data.x, data.y)}
      position={{ x: node.x, y: node.y }}
      bounds={"parent"}
    >
      <div
        id={node.id}
        className={"node node-" + node.type + selectedClass + readOutClass}
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
        {getNodeProps(node)}
      </div>
    </Draggable>
  );
};

export default Node;

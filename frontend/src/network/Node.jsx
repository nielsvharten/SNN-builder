import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

function getDefaultProps(node) {
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

function getSpikeProp(spike) {
  if (spike === "true") {
    return (
      <div
        className="node-prop node-prop-spike"
        style={{
          position: "absolute",
          top: "2px",
          left: "54px",
          fontSize: "larger",
        }}
      >
        ⚡
      </div>
    );
  }
}

function getExecutionProps(node, voltage, spike) {
  if (node.type !== "lif") {
    return getSpikeProp(spike);
  }

  return (
    <React.Fragment>
      <div
        className="node-prop node-prop-v"
        style={{
          position: "absolute",
          top: "-10px",
          left: "50px",
          fontSize: "small",
        }}
      >
        V={voltage}
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
      {getSpikeProp(spike)}
    </React.Fragment>
  );
}

function getNodeProps(node, editMode, voltage, spike) {
  if (voltage !== null) {
    return getExecutionProps(node, voltage, spike);
  } else {
    return getDefaultProps(node);
  }
}

const Node = ({
  node,
  selected,
  editMode,
  voltage,
  spike,
  storedName,
  onStopDragNode,
  onClickNode,
  onRenameNode,
}) => {
  const updateXarrow = useXarrow();
  const selectedClass = selected ? " selected" : "";
  const readOutClass = node.read_out ? " read-out" : "";

  return (
    <Draggable
      onStart={() => onClickNode(node)}
      onDrag={updateXarrow}
      onStop={(_, data) => onStopDragNode(node, data.x, data.y)}
      position={{ x: node.x, y: node.y }}
      bounds={"parent"}
      disabled={!editMode}
    >
      <div
        id={node.id}
        className={"node node-" + node.type + selectedClass + readOutClass}
        onClick={() => onClickNode(node)}
      >
        <div
          className="node-name"
          contentEditable={editMode}
          spellCheck="false"
          onInput={(e) => onRenameNode(node, e.currentTarget.textContent)}
        >
          {storedName}
        </div>
        {getNodeProps(node, editMode, voltage, spike)}
      </div>
    </Draggable>
  );
};

export default Node;

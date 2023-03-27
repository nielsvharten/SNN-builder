import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

function getDefaultProps(node) {
  switch (node.type) {
    case "lif":
      return (
        <React.Fragment>
          <div className="node-prop node-prop-m">m={node.m}</div>
          <div className="node-prop node-prop-thr">T={node.thr}</div>
        </React.Fragment>
      );
    case "random":
      return <div className="node-prop node-prop-type">R</div>;
    case "input":
      return <div className="node-prop node-prop-type">IT</div>;
    default:
      return;
  }
}

function getSpikeProp(spike) {
  if (spike === "true") {
    return <div className="node-prop node-prop-spike">⚡</div>;
  }
}

function getExecutionProps(node, voltage, spike) {
  if (node.type !== "lif") {
    return getSpikeProp(spike);
  }

  return (
    <React.Fragment>
      <div className="node-prop node-prop-v">V={voltage}</div>
      <div className="node-prop node-prop-thr">T={node.thr}</div>
      {getSpikeProp(spike)}
    </React.Fragment>
  );
}

function getNodeProps(node, voltage, spike) {
  if (voltage !== null) {
    return getExecutionProps(node, voltage, spike);
  } else {
    return getDefaultProps(node);
  }
}

function getClassNames(type, selected = false, readOut = false) {
  const selectedClass = selected ? " selected" : "";

  if (readOut) {
    return "node-shape-read-out " + selectedClass;
  }

  return "node-shape-" + type + selectedClass;
}

const Node = ({
  node,
  selected,
  editMode,
  voltage,
  spike,
  onStartDragNode,
  onStopDragNode,
  onClickNode,
  onRenameNode,
}) => {
  const updateXarrow = useXarrow();

  return (
    <Draggable
      onStart={() => {
        onStartDragNode();
        onClickNode(node);
      }}
      onDrag={updateXarrow}
      onStop={(_, data) => onStopDragNode(node, data.x, data.y)}
      position={{ x: node.x, y: node.y }}
      bounds={"parent"}
      disabled={!editMode}
    >
      <div
        id={node.id}
        className={"node-wrapper"}
        onClick={() => onClickNode(node)}
      >
        <div className="node-cut-off">
          <div
            className={
              "node-shape " + getClassNames(node.type, selected, node.read_out)
            }
          ></div>
        </div>
        <div
          className="node-name"
          contentEditable={editMode}
          spellCheck="false"
          onBlur={(e) => onRenameNode(node, e.currentTarget.textContent)}
        >
          {node.name}
        </div>
        {getNodeProps(node, voltage, spike)}
      </div>
    </Draggable>
  );
};

export default Node;

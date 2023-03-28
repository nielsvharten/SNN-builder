import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

function getSpikeProp() {
  return <div className="node-prop node-prop-spike">⚡</div>;
}

function getLifProps(node, voltage) {
  const flexProp = voltage !== null ? "V=" + voltage : "m=" + node.m;

  return (
    <React.Fragment>
      <div className="node-prop node-prop-m">{flexProp}</div>
      <div className="node-prop node-prop-thr">T={node.thr}</div>
    </React.Fragment>
  );
}

function getInputProps(node) {
  const type = node.type === "input" ? "IT" : "R";

  return <div className="node-prop node-prop-type">{type}</div>;
}

function getNodeProps(node, voltage, spike) {
  return (
    <React.Fragment>
      {node.type === "lif" ? getLifProps(node, voltage) : getInputProps(node)}
      {spike === "true" ? getSpikeProp() : null}
    </React.Fragment>
  );
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

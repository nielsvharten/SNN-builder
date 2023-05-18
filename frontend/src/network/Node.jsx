import React from "react";
import Draggable from "react-draggable";

function getSpikeProp() {
  return <div className="node-prop node-prop-spike">⚡</div>;
}

function getLifProps(m, thr, voltage) {
  const flexProp = voltage !== null ? "V=" + voltage : "m=" + m;

  return (
    <React.Fragment>
      <div className="node-prop node-prop-m">{flexProp}</div>
      <div className="node-prop node-prop-thr">T={thr}</div>
    </React.Fragment>
  );
}

function getInputTrainProps() {
  return <div className="node-prop node-prop-type">IT</div>;
}

function getRandomSpikerProps(p) {
  return (
    <React.Fragment>
      <div className="node-prop node-prop-p">p={p}</div>
      <div className="node-prop node-prop-type">R</div>
    </React.Fragment>
  );
}

function getNodeProps(node, voltage, spike) {
  let nodeProp;
  if (node.type === "lif") {
    nodeProp = getLifProps(node.m, node.thr, voltage);
  } else if (node.type === "input") {
    nodeProp = getInputTrainProps();
  } else if (node.type === "random") {
    nodeProp = getRandomSpikerProps(node.p);
  }

  return (
    <React.Fragment>
      {nodeProp}
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
  onDragNode,
  onStopDragNode,
  onClickNode,
  onRenameNode,
}) => {
  return (
    <Draggable
      onStart={() => {
        onClickNode(node);
      }}
      onDrag={(_, data) => onDragNode(node, data.x, data.y)}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
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

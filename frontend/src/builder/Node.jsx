import React from "react";
import { useXarrow } from "react-xarrows";
import Draggable from "react-draggable";

const Node = ({ node, onStopDragNode, onClickNode, onRenameNode }) => {
  const updateXarrow = useXarrow();
  let selectedClass = node.selected === true ? " selected" : "";

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
          {node.id}
        </div>
        <div
          style={{
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            borderRadius: "50%",
            left: "25px",
            top: "-7px",
          }}
        ></div>
        <div
          style={{
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            borderRadius: "50%",
            left: "56px",
            top: "25px",
          }}
        ></div>
        <div
          style={{
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            borderRadius: "50%",
            left: "42px",
            top: "-2px",
          }}
        ></div>
        <div
          style={{
            height: "8px",
            width: "8px",
            backgroundColor: "black",
            position: "absolute",
            borderRadius: "50%",
            left: "52px",
            top: "10px",
          }}
        ></div>
      </div>
    </Draggable>
  );
};

export default Node;

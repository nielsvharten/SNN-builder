import React from "react";

const Loop = ({ x, y, color, labels, onClickSynapse }) => {
  return (
    <React.Fragment>
      <svg
        width="71"
        height="82"
        style={{
          position: "absolute",
          left: x - 60,
          top: y - 50,
        }}
        overflow="auto"
      >
        <path
          d="M 60 80 C 10 80, 40 20, 64 51"
          stroke={color}
          stroke-width="3"
          fill="transparent"
          cursor="pointer"
          pointerEvents="visibleStroke"
          onClick={onClickSynapse}
        ></path>
        <g
          fill={color}
          pointer-events="auto"
          transform="translate(65,40) rotate(45) scale(18)"
          opacity="1"
          cursor="pointer"
          pointerEvents="visibleStroke"
          onClick={onClickSynapse}
        >
          <path d="M 0 0 L 1 0.5 L 0 1 L 0.25 0.5 z"></path>
        </g>
      </svg>
      <div
        style={{
          display: "table",
          width: "max-content",
          position: "absolute",
          left: x - 85,
          top: y - 10,
          zIndex: 1,
        }}
      >
        {labels}
      </div>
    </React.Fragment>
  );
};

export default Loop;

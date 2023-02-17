import React, { Component } from "react";

const Counter = ({ counter, onIncrement, onDelete }) => {
  return (
    <div>
      <span>{counter.value}</span>
      <button
        onClick={() => onIncrement(counter)}
        className="btn btn-secondary btn-sm m-2"
      >
        Increment
      </button>
      <button
        onClick={() => onDelete(counter.id)}
        className="btn btn-danger btn-sm m-2"
      >
        Delete
      </button>
    </div>
  );
};

export default Counter;

import React, { Component } from "react";

class Config extends Component {
  state = {
    lifOptions: ["m"],
  };

  render() {
    const { nodes } = this.props;
    const selectedNode = nodes.find((node) => node.selected === true);

    return (
      <div>
        {this.state.lifOptions.map((option) => (
          <div>{option + ": " + selectedNode[option]}</div>
        ))}
      </div>
    );
  }
}

export default Config;

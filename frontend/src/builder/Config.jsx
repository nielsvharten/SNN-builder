import React, { Component } from "react";

class Config extends Component {
  state = {
    lifOptions: {
      m: "Inverse leakage (m)",
      V_init: "Initial voltage",
      V_reset: "Reset voltage (R)",
      thr: "Spiking threshold (T)",
      I_e: "Constant input current",
    },
    inputOptions: {
      train: "Input spike train",
      loop: "Whether to loop the train",
    },
  };

  getConfigOption(node, key, label) {
    return (
      <div className="form-group row" key={key}>
        <div className="col-sm-5">
          <label className="col-form-label">{label}</label>
        </div>
        <div className="col-sm-2">
          <input
            className="form-control"
            value={node[key]}
            onChange={(e) =>
              this.props.onChangeOption(node, key, e.target.value)
            }
          ></input>
        </div>
      </div>
    );
  }

  getConfigSelectedNode(selectedNode, options) {
    if (selectedNode) {
      return (
        <div className="column">
          <h3>
            Editing {selectedNode.type} {selectedNode.name}
          </h3>
          {Object.keys(options).map((key) =>
            this.getConfigOption(selectedNode, key, options[key])
          )}
          <button
            className="btn btn-danger"
            onClick={() => this.props.onDeleteNode(selectedNode.id)}
          >
            Delete node
          </button>
        </div>
      );
    } else {
      return <div className="column"></div>;
    }
  }

  render() {
    const { nodes } = this.props;
    const selectedNode = nodes.find((node) => node.selected === true);
    let options =
      selectedNode && selectedNode.type === "lif"
        ? this.state.lifOptions
        : this.state.inputOptions;

    return this.getConfigSelectedNode(selectedNode, options);
  }
}

export default Config;

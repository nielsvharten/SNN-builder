import React, { Component } from "react";

class Option extends Component {
  getFloatInput() {
    const { value, onChangeOption } = this.props;

    return (
      <input
        className="form-control"
        type="number"
        value={value}
        onChange={(e) => onChangeOption(e.target.value)}
      />
    );
  }

  getIntInput() {
    const { value, onChangeOption } = this.props;

    return (
      <input
        className="form-control"
        type="number"
        value={value}
        pattern="[0-9]"
        onChange={(e) => {
          e.preventDefault();
          onChangeOption(e.target.value);
        }}
      />
    );
  }

  getBoolInput() {
    const { value, onChangeOption } = this.props;

    return (
      <input
        className="form-check-input"
        type="checkbox"
        checked={value}
        onChange={(e) => onChangeOption(e.target.checked)}
        style={{ height: "24px", width: "24px" }}
      />
    );
  }

  getFloatListInput() {
    const { value, onChangeOption } = this.props;

    return (
      <input
        className="form-control"
        value={value}
        onChange={(e) => onChangeOption(e.target.value)}
      />
    );
  }

  getInput(option) {
    switch (option.type) {
      case "float":
        return this.getFloatInput();
      case "int":
        return this.getIntInput();
      case "bool":
        return this.getBoolInput();
      case "float-list":
        return this.getFloatListInput();
    }
  }

  render() {
    const { option } = this.props;

    return (
      <div className="form-group row m-1">
        <div className="col-sm-7">
          <label className="col-form-label">{option.text}</label>
        </div>
        <div className="col-sm-5">{this.getInput(option)}</div>
      </div>
    );
  }
}

export default Option;

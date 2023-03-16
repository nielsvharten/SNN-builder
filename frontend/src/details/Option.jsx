import React, { Component } from "react";

class Option extends Component {
  getNumberInput(option, value, editMode, onChangeOption) {
    return (
      <input
        className="form-control"
        type="text"
        value={value}
        disabled={!editMode}
        placeholder={option.default}
        onChange={(e) => onChangeOption(e.target.value)}
      />
    );
  }

  getBoolInput(value, editMode, onChangeOption) {
    return (
      <input
        className="form-check-input"
        type="checkbox"
        checked={value}
        disabled={!editMode}
        onChange={(e) => onChangeOption(e.target.checked)}
        style={{ height: "24px", width: "24px" }}
      />
    );
  }

  getFloatListInput(value, editMode, onChangeOption) {
    return (
      <input
        className="form-control"
        type="text"
        value={value}
        disabled={!editMode}
        onChange={(e) => onChangeOption(e.target.value)}
      />
    );
  }

  getInput(option, value, editMode, onChangeOption) {
    switch (option.type) {
      case "float":
      case "int":
        return this.getNumberInput(option, value, editMode, onChangeOption);
      case "bool":
        return this.getBoolInput(value, editMode, onChangeOption);
      case "float-list":
        return this.getFloatListInput(value, editMode, onChangeOption);
    }
  }

  render() {
    const { option, value, editMode, onChangeOption } = this.props;

    return (
      <div className="form-group row m-2" style={{ maxWidth: "400px" }}>
        <div className="col-sm-8">
          <label className="col-form-label">{option.text}</label>
        </div>
        <div className="col-sm-4">
          {this.getInput(option, value, editMode, onChangeOption)}
        </div>
      </div>
    );
  }
}

export default Option;

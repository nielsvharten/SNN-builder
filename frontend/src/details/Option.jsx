import React, { Component } from "react";

class Option extends Component {
  insertInfinity(e, onChangeOption) {
    if (e.ctrlKey && e.shiftKey) {
      const oldValue = e.target.value;
      const cursor = e.target.selectionStart;
      onChangeOption(
        oldValue.slice(0, cursor) + "\u221E" + oldValue.slice(cursor)
      );
    }
  }

  getNumberInput(option) {
    const { value, editMode, onChangeOption, onBlurOption } = this.props;

    return (
      <input
        className="form-control"
        type="text"
        value={value}
        disabled={!editMode && option.name !== "duration"}
        placeholder={option.default}
        onKeyDown={(e) => this.insertInfinity(e, onChangeOption)}
        onChange={(e) => onChangeOption(e.target.value)}
        onBlur={onBlurOption}
      />
    );
  }

  getBoolInput() {
    const { value, editMode, onChangeOption, onBlurOption } = this.props;

    return (
      <input
        className="form-check-input"
        type="checkbox"
        checked={value}
        disabled={!editMode}
        onKeyDown={(e) => this.insertInfinity(e, onChangeOption)}
        onChange={(e) => onChangeOption(e.target.checked)}
        onBlur={onBlurOption}
        style={{ height: "24px", width: "24px" }}
      />
    );
  }

  getFloatListInput() {
    const { value, editMode, onChangeOption, onBlurOption } = this.props;

    return (
      <input
        className="form-control"
        type="text"
        value={value}
        disabled={!editMode}
        onKeyDown={(e) => this.insertInfinity(e, onChangeOption)}
        onChange={(e) => onChangeOption(e.target.value)}
        onBlur={onBlurOption}
      />
    );
  }

  getInput(option) {
    switch (option.type) {
      case "float":
      case "int":
        return this.getNumberInput(option);
      case "bool":
        return this.getBoolInput();
      case "float-list":
        return this.getFloatListInput();
      default:
        return;
    }
  }

  render() {
    const { option } = this.props;
    return (
      <div className="form-group row m-2">
        <div className="col-sm-8">
          <label className="col-form-label">{option.text}</label>
        </div>
        <div className="col" style={{ width: "100px" }}>
          {this.getInput(option)}
        </div>
      </div>
    );
  }
}

export default Option;

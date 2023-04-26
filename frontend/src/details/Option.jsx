import React, { Component } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Col";

class Option extends Component {
  insertInfinity(e, onChangeOption) {
    if (e.ctrlKey && e.shiftKey && e.code === "Digit8") {
      const oldValue = e.target.value;
      onChangeOption(
        oldValue.slice(0, e.target.selectionStart) +
          "\u221E" +
          oldValue.slice(e.target.selectionEnd)
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
        style={{ textAlign: "center" }}
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
      <InputGroup.Checkbox
        checked={value}
        disabled={!editMode}
        onKeyDown={(e) => this.insertInfinity(e, onChangeOption)}
        onChange={(e) => onChangeOption(e.target.checked)}
        onBlur={onBlurOption}
        style={{
          marginLeft: "26px",
          marginRight: "26px",
          height: "24px",
          width: "24px",
          marginTop: "0px",
          marginBottom: "0px",
        }}
      />
    );
  }

  getFloatListInput() {
    const { value, editMode, onChangeOption, onBlurOption } = this.props;

    return (
      <Form.Control
        type="text"
        value={value}
        style={{ textAlign: "center" }}
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
    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        {option.description}
      </Tooltip>
    );

    return (
      <Form className="row m-0">
        <Form.Label column sm="6 m-2">
          {option.text}
        </Form.Label>
        <InputGroup className="col m-2">
          {this.getInput(option)}
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
          >
            <InputGroup.Text>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="gray"
                className="bi bi-info-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </InputGroup.Text>
          </OverlayTrigger>
        </InputGroup>
      </Form>
    );
  }
}

export default Option;

import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Option from "./Option";

class NetworkDetails extends Component {
  getEditorDetails() {
    const { nrNodes, nrSynapses, editMode } = this.props;
    if (!editMode) {
      return;
    }

    return (
      <React.Fragment>
        <div className="form-group row m-2">
          <div className="col-sm-8">
            <label className="col-form-label">Number of nodes</label>
          </div>
          <div className="col-sm-4">
            <input
              className=" form-control"
              disabled={true}
              value={nrNodes}
            ></input>
          </div>
        </div>
        <div className="form-group row m-2">
          <div className="col-sm-8">
            <label className="col-form-label">Number of synapses</label>
          </div>
          <div className="col-sm-4">
            <input
              className=" form-control"
              disabled={true}
              value={nrSynapses}
            ></input>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getDetails() {
    const { editMode, duration, onChangeDuration, onBlurDuration } = this.props;

    const option = {
      name: "duration",
      type: "int",
      text: "Execution time steps",
      default: 10,
      min: 1,
      max: 9007199254740991,
    };

    return (
      <React.Fragment>
        {this.getEditorDetails()}
        <Option
          key={option.name}
          option={option}
          value={duration}
          editMode={editMode}
          onChangeOption={(newValue) => onChangeDuration(option, newValue)}
          onBlurOption={() => onBlurDuration(option.default)}
        />
      </React.Fragment>
    );
  }

  getButtons() {
    const {
      editMode,
      undo,
      redo,
      onExecuteNetwork,
      onSwitchEditMode,
      onUndo,
      onRedo,
    } = this.props;

    const firstButton = editMode ? (
      <React.Fragment>
        <button
          onClick={onUndo}
          disabled={undo.length === 0}
          className={"col-sm-2 btn btn-secondary m-2"}
          title="ctrl+z"
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={redo.length === 0}
          className={"col-sm-2 btn btn-secondary m-2"}
          title="ctrl+y"
        >
          Redo
        </button>
      </React.Fragment>
    ) : (
      <button
        onClick={() => onSwitchEditMode(true)}
        className="col-sm btn btn-warning m-2"
        title="ctrl+backspace"
      >
        Edit network
      </button>
    );

    return (
      <div className="form-group row m-2" style={{ paddingBottom: "20px" }}>
        {firstButton}
        <button
          onClick={onExecuteNetwork}
          className="col-sm btn btn-primary m-2"
          title="ctrl+enter"
        >
          Execute network
        </button>
      </div>
    );
  }

  getExecutionErrorMessage = () => {
    const { execution } = this.props;

    if (execution && execution.error) {
      return (
        <Alert className="m-3" variant="danger" severity="error">
          Server did not respond to execution request
        </Alert>
      );
    }
  };

  render() {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">Network</h3>
        {this.getDetails()}
        {this.getButtons()}
        {this.getExecutionErrorMessage()}
        <hr className="solid m-2" style={{ paddingBottom: "20px" }}></hr>
      </div>
    );
  }
}

export default NetworkDetails;

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
      text: "Exectution time steps",
      default: 10,
      min: 1,
    };

    return (
      <React.Fragment>
        {this.getEditorDetails()}
        <Option
          key={option.name}
          option={option}
          value={duration}
          editMode={editMode}
          onChangeOption={(newValue) => onChangeDuration(newValue)}
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
      onSaveNetwork,
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
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          disabled={redo.length === 0}
          className={"col-sm-2 btn btn-secondary m-2"}
        >
          Redo
        </button>
      </React.Fragment>
    ) : (
      <button
        onClick={() => onSwitchEditMode(true)}
        className="col-sm btn btn-warning m-2"
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

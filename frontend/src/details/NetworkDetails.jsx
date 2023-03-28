import React, { Component } from "react";

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
    const { duration, onChangeDuration } = this.props;
    const DURATION = 10;

    return (
      <React.Fragment>
        {this.getEditorDetails()}
        <div className="form-group row m-2">
          <div className="col-sm-8">
            <label className="col-form-label">Execution time steps</label>
          </div>
          <div className="col-sm-4">
            <input
              className=" form-control"
              type="text"
              placeholder={DURATION}
              value={duration}
              onChange={(e) => onChangeDuration(e.target.value)}
              onBlur={(e) => {
                if (e.target.value === "") {
                  onChangeDuration(DURATION);
                }
              }}
            ></input>
          </div>
        </div>
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
          className={
            undo.length === 0
              ? "col-sm-2 btn btn-secondary m-2 disabled"
              : "col-sm-2 btn btn-secondary m-2"
          }
        >
          Undo
        </button>
        <button
          onClick={onRedo}
          className={
            redo.length === 0
              ? "col-sm-2 btn btn-secondary m-2 disabled"
              : "col-sm-2 btn btn-secondary m-2"
          }
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

  render() {
    return (
      <div style={{ maxWidth: "400px" }}>
        <h3 className="m-2">Network</h3>
        {this.getDetails()}
        {this.getButtons()}
        <hr className="solid m-2" style={{ paddingBottom: "20px" }}></hr>
      </div>
    );
  }
}

export default NetworkDetails;

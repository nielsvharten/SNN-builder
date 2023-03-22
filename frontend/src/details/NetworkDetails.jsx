import React, { Component } from "react";

class NetworkDetails extends Component {
  getDetails() {
    const { nrNodes, nrSynapses, duration, onChangeDuration } = this.props;

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
        <div className="form-group row m-2">
          <div className="col-sm-8">
            <label className="col-form-label">Execution time steps</label>
          </div>
          <div className="col-sm-4">
            <input
              className=" form-control"
              type="text"
              placeholder={10}
              value={duration}
              onChange={(e) => onChangeDuration(e.target.value)}
            ></input>
          </div>
        </div>
      </React.Fragment>
    );
  }

  getButtons() {
    const { editMode, onExecuteNetwork, onSaveNetwork, onSwitchEditMode } =
      this.props;

    const firstButton = editMode ? (
      <button onClick={onSaveNetwork} className="col-sm btn btn-success m-2">
        Save network
      </button>
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

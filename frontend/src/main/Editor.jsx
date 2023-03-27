import React, { Component } from "react";
import Navigation from "./Navigation";
import Canvas from "../network/Canvas";
import InputValidator from "../utils/InputValidator";
import NetworkDetails from "../details/NetworkDetails";
import ElementDetails from "../details/ElementDetails";
import { LIF, InputTrain, RandomSpiker } from "../model/node";
import Network from "../model/network";

class Editor extends Component {
  state = {
    selectedNodeId: null,
    selectedSynapseId: null,

    connectMode: false,
    editMode: true,

    loaded: false,

    network: new Network(),

    execution: { timeStep: 0, duration: 10, measurements: {} },

    undo: [],
    redo: [],
  };

  /*
  Global handlers
  */
  handleUpdateNetwork(network) {
    // add old network to undo
    const undo = [...this.state.undo];
    undo.push({ ...this.state.network });

    // set new network
    this.setState({ undo, network });

    // save new network
    this.handleSaveNetwork(network);
  }

  handleUndo = () => {
    const undo = [...this.state.undo];
    const redo = [...this.state.redo];

    if (undo.length > 0) {
      const network = undo.pop();
      redo.push({ ...this.state.network });
      this.setState({ undo, redo, network });

      // save new network
      this.handleSaveNetwork(network);
    }
  };

  handleRedo = () => {
    const undo = [...this.state.undo];
    const redo = [...this.state.redo];

    if (redo.length > 0) {
      const network = redo.pop();
      undo.push({ ...this.state.network });
      this.setState({ undo, redo, network });

      // save new network
      this.handleSaveNetwork(network);
    }
  };

  handleDeselectElements = () => {
    this.setState({ selectedNodeId: null, selectedSynapseId: null });
  };

  handleSelectNode = (nodeId) => {
    const selectedNodeId = nodeId;
    const selectedSynapseId = null;

    // select node and deselect previous selected node
    this.setState({ selectedNodeId });
    this.setState({ selectedSynapseId });
  };

  handleClickNode = (node) => {
    console.log(node);
    const { connectMode, selectedNodeId } = this.state;

    if (connectMode) {
      if (node.type !== "lif") {
        return;
      }
      this.handleAddSynapse(selectedNodeId, node.id);

      // disable connect mode
      this.handleSwitchConnectMode(false);
    } else {
      this.handleSelectNode(node.id);
    }
  };

  handleSelectSynapse = (synapseId) => {
    const selectedSynapseId = synapseId;
    const selectedNodeId = null;

    // select node and deselect previous selected node
    this.setState({ selectedSynapseId });
    this.setState({ selectedNodeId });
  };

  handleClickSynapse = (synapseId) => {
    this.handleSelectSynapse(synapseId);
  };

  handleSwitchEditMode = (editMode) => {
    const execution = { ...this.state.execution };
    execution.measurements = {};
    this.setState({ execution }); // remove execution
    this.setState({ editMode }); // set edit mode
    this.setState({ connectMode: false }); // disable connectMode
  };

  /*
  Handlers for modifying the network
  */
  handleSaveNetwork(network) {
    const jsonState = JSON.stringify(network);
    window.localStorage.setItem("network", jsonState);
  }

  handleAddNode = (type) => {
    const network = { ...this.state.network };
    const id = network.maxNodeId + 1;

    let node;
    switch (type) {
      case "lif":
        node = new LIF(id);
        break;
      case "input":
        node = new InputTrain(id);
        break;
      case "random":
        node = new RandomSpiker(id);
        break;
      default:
        node = null;
    }

    network.nodes = network.nodes.concat(node);
    network.maxNodeId = id;

    this.handleUpdateNetwork(network);
  };

  handleDeleteNode = (nodeId) => {
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((node) => node.id !== nodeId);
    network.synapses = network.synapses.filter(
      (synapse) => synapse.pre !== nodeId && synapse.post !== nodeId
    );

    this.handleUpdateNetwork(network);
  };

  handleStartDragNode = () => {
    const undo = [...this.state.undo];
    undo.push(this.state.network);

    this.setState({ undo });
  };

  handleStopDragNode = (node, x, y) => {
    const network = { ...this.state.network };
    const nodes = [...network.nodes];
    const index = nodes.indexOf(node);
    nodes[index] = { ...node };
    nodes[index].x = x;
    nodes[index].y = y;

    network.nodes = nodes;
    this.setState({ network });
    this.handleSaveNetwork(network);
  };

  handleRenameNode = (node, newName) => {
    const network = { ...this.state.network };
    const nodes = [...network.nodes];
    const index = nodes.indexOf(node);
    nodes[index] = { ...node };
    nodes[index].name = newName;

    network.nodes = nodes;
    this.setState({ network });
  };

  handleAddSynapse = (preId, postId) => {
    if (preId === null || postId === null) {
      return;
    }

    const network = { ...this.state.network };
    const id = network.maxSynapseId + 1;

    const synapse = {
      id: id,
      pre: preId,
      post: postId,
      w: 1.0,
      d: 1,
    };

    network.synapses = network.synapses.concat(synapse);
    network.maxSynapseId = id;

    this.handleUpdateNetwork(network);
  };

  handleDeleteSynapse = (synapseId) => {
    const network = { ...this.state.network };
    network.synapses = network.synapses.filter((s) => s.id !== synapseId);
    console.log(synapseId);

    this.handleUpdateNetwork(network);
  };

  handleChangeOption = (element, elementType, option, newValue) => {
    const network = { ...this.state.network };
    const elements = [...network[elementType]];
    const index = elements.indexOf(element);
    const oldValue = elements[index][option.name];

    // TODO: check if input is valid
    const validatedValue = InputValidator(
      option.type,
      oldValue,
      newValue,
      option.min,
      option.max
    );

    elements[index] = { ...element };
    elements[index][option.name] = validatedValue;
    network[elementType] = elements;

    this.handleUpdateNetwork(network);
  };

  handleSwitchConnectMode = (connectMode) => {
    this.setState({ connectMode });
  };

  /* 
  Handlers for executing the network
  */
  handleExecuteNetwork = () => {
    this.handleSwitchEditMode(false);

    fetch("http://127.0.0.1:5000/network", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "localhost:5000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.network),
    })
      .then((response) => response.json())
      .then((execution) => this.setState({ execution }))
      .catch();
  };

  handleChangeDuration = (newValue) => {
    let network = { ...this.state.network };
    const duration = InputValidator("int", network.duration, newValue);
    network.duration = duration;

    this.handleUpdateNetwork(network);
  };

  handleUpdateTimeStep = (newValue) => {
    const execution = { ...this.state.execution };
    if (newValue >= execution.duration || newValue < 0) {
      return;
    }

    execution.timeStep = newValue;
    this.setState({ execution });
  };

  /*
  Components of the Editor 
  */
  getExecutionSlider() {
    const execution = this.state.execution;
    const nrNodes = Object.keys(execution.measurements).length;

    if (nrNodes > 0) {
      const nrTimeSteps = Object.values(execution.measurements)[0]["voltages"]
        .length;

      return (
        <div className="form-group row m-2" style={{ width: "700px" }}>
          <input
            className="col-sm-4 m-2"
            type="range"
            min={0}
            max={nrTimeSteps - 1}
            value={execution.timeStep}
            onChange={(e) => this.handleUpdateTimeStep(e.target.value)}
          />
          <br />
          <button
            className="btn btn-secondary col-sm-1"
            onClick={() =>
              this.handleUpdateTimeStep(Number(execution.timeStep) - 1)
            }
          >
            prev
          </button>
          <p className="col-sm-1 m-2" style={{ textAlign: "center" }}>
            {execution.timeStep}
          </p>
          <button
            className="btn btn-secondary col-sm-1"
            onClick={() =>
              this.handleUpdateTimeStep(Number(execution.timeStep) + 1)
            }
          >
            next
          </button>
        </div>
      );
    }
  }

  getButtons() {
    if (this.state.editMode) {
      return (
        <React.Fragment>
          <button
            onClick={() => this.handleAddNode("lif")}
            className="btn btn-primary m-2"
          >
            Add lif
          </button>
          <button
            onClick={() => this.handleAddNode("input")}
            className="btn btn-warning m-2"
          >
            Add input
          </button>
          <button
            onClick={() => this.handleUndo()} //this.handleAddNode("random")}
            className="btn btn-danger m-2"
          >
            Add random
          </button>
        </React.Fragment>
      );
    }
  }

  getEditor() {
    const {
      network,
      editMode,
      connectMode,
      execution,
      selectedNodeId,
      selectedSynapseId,
    } = this.state;

    return (
      <React.Fragment>
        <Navigation
          network={network}
          // handlers
          onChangeNetwork={this.handleChangeNetwork}
        />
        <div className="builder">
          <Canvas
            network={network}
            execution={execution}
            editMode={editMode}
            connectMode={connectMode}
            // selected element
            selectedNodeId={selectedNodeId}
            selectedSynapseId={selectedSynapseId}
            // handlers
            onStartDragNode={this.handleStartDragNode}
            onStopDragNode={this.handleStopDragNode}
            onClickNode={this.handleClickNode}
            onClickSynapse={this.handleClickSynapse}
            onRenameNode={this.handleRenameNode}
            onDeselectElements={this.handleDeselectElements}
          />
          <div className="column-right">
            <NetworkDetails
              editMode={this.state.editMode}
              duration={network.duration}
              nrNodes={network.nodes.length}
              nrSynapses={network.synapses.length}
              undo={this.state.undo}
              redo={this.state.redo}
              // handlers
              onExecuteNetwork={this.handleExecuteNetwork}
              onSaveNetwork={() => this.handleSaveNetwork(this.state.network)}
              onSwitchEditMode={this.handleSwitchEditMode}
              onChangeDuration={this.handleChangeDuration}
              onUndo={this.handleUndo}
              onRedo={this.handleRedo}
            />
            <ElementDetails
              nodes={network.nodes}
              synapses={network.synapses}
              measurements={execution.measurements}
              // selected element
              selectedNodeId={selectedNodeId}
              selectedSynapseId={selectedSynapseId}
              // current mode
              connectMode={this.state.connectMode}
              editMode={this.state.editMode}
              // handlers
              onDeleteNode={this.handleDeleteNode}
              onDeleteSynapse={this.handleDeleteSynapse}
              onChangeOption={this.handleChangeOption}
              onSwitchConnectMode={this.handleSwitchConnectMode}
            />
          </div>
        </div>
        {this.getExecutionSlider()}
        {this.getButtons()}
      </React.Fragment>
    );
  }

  handleChangeNetwork = (network) => {
    this.handleSwitchEditMode(true);

    const undo = [...this.state.undo];
    undo.push(this.state.network);

    this.setState({ network, undo });
  };

  // try loading network json object from local storage
  componentDidMount() {
    const jsonState = window.localStorage.getItem("network");
    if (jsonState === null) {
      console.log("no network defined");
      this.setState({ loaded: true });
      return;
    }

    const network = JSON.parse(jsonState);
    this.setState({ network, loaded: true });
  }

  render() {
    if (this.state.loaded) {
      return this.getEditor();
    }
  }
}

export default Editor;

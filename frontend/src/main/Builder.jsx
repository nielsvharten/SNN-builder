import React, { Component } from "react";
import { GlobalHotKeys } from "react-hotkeys";
import Navigation from "./Navigation";
import Canvas from "../network/Canvas";
import InputValidator from "../utils/InputValidator";
import NetworkDetails from "../details/NetworkDetails";
import ElementDetails from "../details/ElementDetails";
import Config from "./Config";
import Plot from "../details/Plot";
import { LIF, InputTrain, RandomSpiker } from "../model/node";
import Network from "../model/network";
import Synapse from "../model/synapse";
import Execution from "../model/execution";
import data from "./options.json";

// import options from options.json
const { options } = data;

const keyMap = {
  ADD_LIF: "ctrl+shift+l",
  ADD_INPUT: "ctrl+shift+i",
  ADD_RANDOM: "ctrl+shift+r",
  CONNECT_MODE: "ctrl+shift+c",
  DELETE_SELECTED: "del",
  UNDO: "ctrl+z",
  REDO: "ctrl+y",
  EXECUTE: "ctrl+enter",
  EDIT: "ctrl+backspace",
};

class Builder extends Component {
  state = {
    // selected element
    selectedNodeId: null,
    selectedSynapseId: null,

    // current mode
    connectMode: false,
    editMode: true,
    showConfig: false,
    configError: null,

    // network
    network: new Network(),
    loaded: false,

    // execution details
    execution: null,

    // undo-redo history
    savedState: new Network(),
    undo: [],
    redo: [],
  };

  /*
  Global handlers
  */
  handleChangeNetwork = (network) => {
    this.handleSwitchEditMode(true);

    const undo = [...this.state.undo];
    undo.push(this.state.network);

    this.setState({ network, undo });
  };

  handleToggleConfig = (showConfig) => {
    this.setState({ showConfig, configError: null });
  };

  nodeFeatureNonDefault = (feature, network) => {
    const option = options.node[feature];
    const nonDefault = network.nodes.find(
      (node) =>
        node[feature] && node[feature].toString() !== option.default.toString()
    );

    return nonDefault;
  };

  synapseRuleBroken = (feature, network) => {
    if (feature === "synapseBundles") {
      let example = null;
      let connections = {};

      network.synapses.every((s) => {
        if (connections[[s.pre, s.post]]) {
          example = s;
          return false;
        }

        connections[[s.pre, s.post]] = 1;
        return true;
      });

      return example;
    } else if (feature === "selfLoops") {
      return network.synapses.find((s) => s.pre === s.post);
    }
  };

  handleToggleFeature = (type, feature, enabled) => {
    const network = { ...this.state.network };
    const config = { ...network.config };
    const features = { ...config[type] };

    // on disable, check if rules are satisfied
    if (!enabled) {
      let error = undefined;
      if (type === "synapseRules") {
        error = this.synapseRuleBroken(feature, network);
      } else if (type === "nodeFeatures") {
        error = this.nodeFeatureNonDefault(feature, network);
      }

      if (error) {
        this.setState({
          configError: { feature: feature, details: error },
        });
        return;
      }
    }

    features[feature] = enabled;
    config[type] = features;
    network.config = config;

    this.handleChangeNetwork(network);
  };

  handleDeselectElement = () => {
    this.setState({ selectedNodeId: null, selectedSynapseId: null });
  };

  handleSelectNode = (nodeId) => {
    // select node and deselect previous selected element if applicable
    this.setState({ selectedNodeId: nodeId, selectedSynapseId: null });
  };

  handleClickNode = (node) => {
    const { connectMode, selectedNodeId } = this.state;

    if (connectMode) {
      if (node.type !== "lif") return;

      const pre = selectedNodeId;
      const post = node.id;

      // check synapseRules
      const { synapses, config } = this.state.network;
      const exists = synapses.find((s) => pre === s.pre && post === s.post);
      if (exists && !config.synapseRules.synapseBundles) return;
      if (pre === post && !config.synapseRules.selfLoops) return;

      // try to connect clicked LIF to selectedNode
      this.handleAddSynapse(pre, post);

      // disable connect mode
      this.handleSwitchConnectMode();
    } else {
      this.handleSelectNode(node.id);
    }
  };

  handleSelectSynapse = (synapseId) => {
    // select node and deselect previous selected element if applicable
    this.setState({ selectedSynapseId: synapseId, selectedNodeId: null });
  };

  handleSwitchEditMode = (editMode) => {
    // switch between editing and executing the network
    this.setState({ editMode }); // set edit mode
    this.setState({ execution: null }); // remove execution
    this.setState({ connectMode: false }); // disable connectMode
  };

  /*
  Handlers for modifying the network
  */
  handleSaveNetwork(network) {
    // save network to local browser storage
    const jsonState = JSON.stringify(network);
    window.localStorage.setItem("network", jsonState);
  }

  handleStoreNetworkState(network) {
    // add savedState to undo
    const undo = [...this.state.undo];
    const savedState = this.state.savedState;
    undo.push(savedState);

    // set new network and overwrite savedState
    const newSavedState = { ...network };
    this.setState({ network, undo, savedState: newSavedState });

    // save the network
    this.handleSaveNetwork(network);
  }

  handleUndo = () => {
    if (!this.state.editMode) {
      return;
    }

    const undo = [...this.state.undo];
    const redo = [...this.state.redo];

    if (undo.length > 0) {
      // reinstate previous network and overwrite savedState
      const network = undo.pop();
      const savedState = { ...network };

      redo.push({ ...this.state.network });
      this.setState({ network, undo, redo, savedState });

      // save the network
      this.handleSaveNetwork(network);
    }
  };

  handleRedo = () => {
    if (!this.state.editMode) {
      return;
    }

    const undo = [...this.state.undo];
    const redo = [...this.state.redo];

    if (redo.length > 0) {
      // reinstate next network and overwrite savedState
      const network = redo.pop();
      const savedState = { ...network };

      undo.push({ ...this.state.network });
      this.setState({ network, undo, redo, savedState });

      // save the network
      this.handleSaveNetwork(network);
    }
  };

  handleAddNode = (type) => {
    if (!this.state.editMode) {
      return;
    }

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

    this.handleStoreNetworkState(network);
    this.handleSelectNode(id);
  };

  handleDeleteNode = (nodeId) => {
    if (!this.state.editMode) {
      return;
    }

    // remove node and all connected synapses from the network
    const network = { ...this.state.network };
    network.nodes = network.nodes.filter((node) => node.id !== nodeId);
    network.synapses = network.synapses.filter(
      (synapse) => synapse.pre !== nodeId && synapse.post !== nodeId
    );

    // deselect as selectedNode if applicable
    if (this.state.selectedNodeId === nodeId) {
      this.setState({ selectedNodeId: null });
    }

    this.handleStoreNetworkState(network);
  };

  handleDragNode = (node, x, y) => {
    // update position of node after dragging
    const network = { ...this.state.network };
    const nodes = [...network.nodes];
    const index = nodes.indexOf(node);
    nodes[index] = { ...node };

    // only store state if move more than one pixel
    const dx = Math.abs(x - nodes[index].x);
    const dy = Math.abs(y - nodes[index].y);
    if (dx > 1 || dy > 1) {
      nodes[index].x = x;
      nodes[index].y = y;

      network.nodes = nodes;
      this.setState({ network });
    }
  };

  handleStopDragNode = (node, x, y) => {
    // update position of node after dragging
    const network = { ...this.state.network };
    const nodes = [...network.nodes];
    const index = nodes.indexOf(node);
    nodes[index] = { ...node };

    // only store state if moved more than one pixel
    const dx = Math.abs(x - this.state.savedState.nodes[index].x);
    const dy = Math.abs(y - this.state.savedState.nodes[index].y);
    if (dx > 1 || dy > 1) {
      nodes[index].x = x;
      nodes[index].y = y;

      network.nodes = nodes;
      this.handleStoreNetworkState(network);
    }
  };

  handleRenameNode = (node, newName) => {
    const network = { ...this.state.network };
    const nodes = [...network.nodes];
    const index = nodes.indexOf(node);

    // only update name if changed
    if (newName !== nodes[index].name) {
      nodes[index] = { ...node };
      nodes[index].name = newName;

      network.nodes = nodes;
      this.handleStoreNetworkState(network);
    }
  };

  handleAddSynapse = (preId, postId) => {
    if (preId === null || postId === null || !this.state.editMode) {
      return; // synapse requires pre and post neuron
    }

    const network = { ...this.state.network };
    const id = network.maxSynapseId + 1;
    const synapse = new Synapse(id, preId, postId);

    network.synapses = network.synapses.concat(synapse);
    network.maxSynapseId = id;

    this.handleStoreNetworkState(network);
  };

  handleDeleteSynapse = (synapseId) => {
    if (!this.state.editMode) {
      return;
    }

    const network = { ...this.state.network };
    network.synapses = network.synapses.filter((s) => s.id !== synapseId);

    // deselect as selectedSynapse if applicable
    if (this.state.selectedSynapseId === synapseId) {
      this.setState({ selectedSynapseId: null });
    }

    this.handleStoreNetworkState(network);
  };

  handleDeleteSelectedElement = () => {
    if (!this.state.editMode) {
      return;
    }

    const { selectedNodeId, selectedSynapseId } = this.state;

    if (selectedNodeId !== null) {
      this.handleDeleteNode(selectedNodeId);
    } else if (selectedSynapseId !== null) {
      this.handleDeleteSynapse(selectedSynapseId);
    }
  };

  handleChangeOption = (element, elementType, option, newValue) => {
    const network = { ...this.state.network };
    const elements = [...network[elementType]];
    const index = elements.indexOf(element);
    const oldValue = elements[index][option.name];

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

    option.edited = true;
    this.setState({ network });

    return network;
  };

  handleBlurOption = (element, elementType, option) => {
    const value = element[option.name];
    let network = this.state.network;

    // replace value with default if field is left empty
    if (value === "" && typeof option.default !== "undefined") {
      const newValue = option.default;
      network = this.handleChangeOption(element, elementType, option, newValue);
    }

    // only add to undo if value was changed
    if (option.edited === true) {
      this.handleStoreNetworkState(network);
      option.edited = false;
    }
  };

  handleChangeDuration = (newValue) => {
    let network = { ...this.state.network };
    const duration = InputValidator("int", network.duration, newValue, 1);
    network.duration = duration;

    this.setState({ network });
  };

  handleBlurDuration = (defaultValue) => {
    let network = { ...this.state.network };

    // replace value with default if field is left empty
    if (network.duration === "" && defaultValue) {
      network.duration = defaultValue;
    }

    // only add to undo if value was changed compared to savedState
    const savedDuration = this.state.savedState.duration;
    if (network.duration !== savedDuration) {
      this.handleStoreNetworkState(network);
    }
  };

  handleSwitchConnectMode = () => {
    if (!this.state.editMode) {
      return;
    }

    const connectMode = !this.state.connectMode;
    this.setState({ connectMode });
  };

  /* 
  Handlers for executing the network
  */
  handleExecuteNetwork = () => {
    this.handleSwitchEditMode(false);

    // request: network object
    // response: execution object with measurements
    fetch("http://127.0.0.1:5000/network", {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "localhost:5000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.network),
    })
      .then((res) => res.json())
      .then((data) => {
        const execution = new Execution(data.duration, data.measurements);
        this.setState({ execution });
      })
      // TODO: should display some loading screen and error if catched error
      .catch((err) => {
        const execution = new Execution(0, {}, true);
        this.setState({ execution });
      });
  };

  handleUpdateTimeStep = (newValue) => {
    // change execution time step that is currently displayed
    const execution = { ...this.state.execution };
    if (newValue >= execution.duration || newValue < 0) {
      return;
    }

    execution.timeStep = newValue;
    this.setState({ execution });
  };

  /*
  Components of the builder 
  */
  getExecutionSlider() {
    if (this.state.execution === null) {
      return;
    }

    const execution = this.state.execution;
    const nrNodes = Object.keys(execution.measurements).length;
    if (nrNodes > 0) {
      const nrTimeSteps = Object.values(execution.measurements)[0]["voltages"]
        .length;

      return (
        <div className="form-group row m-2 execution-slider">
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
            title={keyMap.ADD_LIF}
          >
            LIF Neuron
          </button>
          <button
            onClick={() => this.handleAddNode("input")}
            className="btn btn-warning m-2"
            title={keyMap.ADD_INPUT}
          >
            Input Train
          </button>
          <button
            onClick={() => this.handleAddNode("random")}
            className="btn btn-danger m-2"
            title={keyMap.ADD_RANDOM}
          >
            Random Spiker
          </button>
        </React.Fragment>
      );
    }
  }

  getHotKeyHandlers() {
    return {
      ADD_LIF: () => this.handleAddNode("lif"),
      ADD_INPUT: (e) => {
        e.preventDefault();
        this.handleAddNode("input");
      },
      ADD_RANDOM: (e) => {
        e.preventDefault();
        this.handleAddNode("random");
      },

      DELETE_SELECTED: this.handleDeleteSelectedElement,
      CONNECT_MODE: (e) => {
        e.preventDefault();
        this.handleSwitchConnectMode();
      },
      UNDO: this.handleUndo,
      REDO: this.handleRedo,
      EXECUTE: this.handleExecuteNetwork,
      EDIT: this.handleSwitchEditMode,
    };
  }

  getPlotsSelectedNode() {
    const { network, selectedNodeId, execution } = this.state;

    if (execution === null) {
      return;
    }

    const selectedNode = network.nodes.find((n) => n.id === selectedNodeId);
    const measurements = execution.measurements;

    if (selectedNode && measurements[selectedNode.id]) {
      return (
        <Plot
          voltages={measurements[selectedNode.id]["voltages"]}
          spikes={measurements[selectedNode.id]["spikes"]}
        />
      );
    }
  }

  getBuilder() {
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
        <GlobalHotKeys keyMap={keyMap} handlers={this.getHotKeyHandlers()} />
        <Navigation
          network={network}
          onChangeNetwork={this.handleChangeNetwork}
          onShowConfig={() => this.handleToggleConfig(true)}
        />
        <div className="content">
          <div className="column-left">
            {this.getPlotsSelectedNode()}
            <Canvas
              network={network}
              execution={execution}
              editMode={editMode}
              connectMode={connectMode}
              // selected element
              selectedNodeId={selectedNodeId}
              selectedSynapseId={selectedSynapseId}
              // handlers
              onDragNode={this.handleDragNode}
              onStopDragNode={this.handleStopDragNode}
              onClickNode={this.handleClickNode}
              onClickSynapse={this.handleSelectSynapse}
              onRenameNode={this.handleRenameNode}
              onDeselectElement={this.handleDeselectElement}
            />
            {this.getExecutionSlider()}
            {this.getButtons()}
          </div>
          <div className="column-right">
            <NetworkDetails
              editMode={this.state.editMode}
              duration={network.duration}
              execution={execution}
              nrNodes={network.nodes.length}
              nrSynapses={network.synapses.length}
              undo={this.state.undo}
              redo={this.state.redo}
              // handlers
              onExecuteNetwork={this.handleExecuteNetwork}
              onSwitchEditMode={this.handleSwitchEditMode}
              onChangeDuration={this.handleChangeDuration}
              onBlurDuration={this.handleBlurDuration}
              onUndo={this.handleUndo}
              onRedo={this.handleRedo}
            />
            <ElementDetails
              nodes={network.nodes}
              synapses={network.synapses}
              optionalFeatures={network.config.nodeFeatures}
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
              onBlurOption={this.handleBlurOption}
              onSwitchConnectMode={this.handleSwitchConnectMode}
            />
          </div>
        </div>
        <Config
          show={this.state.showConfig}
          error={this.state.configError}
          config={this.state.network.config}
          onClose={() => this.handleToggleConfig(false)}
          onToggleFeature={this.handleToggleFeature}
        />
      </React.Fragment>
    );
  }

  componentDidMount() {
    // try loading network json object from local storage
    const jsonState = window.localStorage.getItem("network");
    if (jsonState === null) {
      console.log("no network defined");
      this.setState({ loaded: true });
      return;
    }

    const network = JSON.parse(jsonState);
    const savedState = { ...network };
    this.setState({ network, savedState, loaded: true });
  }

  render() {
    if (this.state.loaded) {
      return this.getBuilder();
    }
  }
}

export default Builder;

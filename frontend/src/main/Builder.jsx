import React, { Component } from "react";
import { GlobalHotKeys, configure } from "react-hotkeys";

import Canvas from "../network/Canvas";
import InputValidator from "../utils/InputValidator";
import NetworkDetails from "../details/NetworkDetails";
import ElementDetails from "../details/ElementDetails";
import Plots from "../details/Plots";
import Navigation from "./Navigation";
import Config from "./Config";
import Help from "./Help";

import { LIF, InputTrain, RandomSpiker } from "../model/node";
import Network from "../model/network";
import Synapse from "../model/synapse";
import Execution from "../model/execution";

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

// allow hotkeys when focused on text
configure({
  ignoreTags: ["input", "select", "textarea"],
  ignoreEventsCondition: function () {},
});

class Builder extends Component {
  state = {
    // selected element
    selectedNodeId: null,
    selectedSynapseId: null,

    // current mode
    connectMode: false,
    editMode: true,
    showHelp: false,
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

  // update state.network and add network to be overwritten to undo
  handleChangeNetwork = (network) => {
    this.handleSwitchEditMode(true);

    const undo = [...this.state.undo];
    undo.push(this.state.network);

    this.setState({ network, undo });
  };

  // display/hide config overlay
  handleToggleConfig = (showConfig) => {
    this.setState({ showConfig, configError: null });
  };

  // display/hide help overlay
  handleToggleHelp = (showHelp) => {
    this.setState({ showHelp });
  };

  // set config error message
  handleConfigError = (feature, error) => {
    this.setState({
      configError: { feature: feature, details: error },
    });
  };

  // enable or disable a feature, rules are checked in Config.jsx
  handleToggleFeature = (type, feature, enabled) => {
    const network = { ...this.state.network };
    const config = { ...network.config };
    const features = { ...config[type] };

    // assumes that on disable, rules are not broken
    features[feature] = enabled;
    config[type] = features;
    network.config = config;

    this.handleChangeNetwork(network);
    this.handleSaveNetwork(network);
  };

  // de-select currently selected node or synapse, used when clicking on canvas
  handleDeselectElement = () => {
    this.setState({ selectedNodeId: null, selectedSynapseId: null });
  };

  // select node and deselect previous selected element if applicable
  handleSelectNode = (nodeId) => {
    this.setState({ selectedNodeId: nodeId, selectedSynapseId: null });
  };

  // if connectMode: try to connect neurons | else: selectNode
  handleClickNode = (node) => {
    const { connectMode, editMode, selectedNodeId } = this.state;

    if (connectMode && editMode) {
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

  // select node and deselect previous selected element if applicable
  handleSelectSynapse = (synapseId) => {
    this.setState({ selectedSynapseId: synapseId, selectedNodeId: null });
  };

  // switch between editing and executing the network
  handleSwitchEditMode = (editMode) => {
    this.setState({ editMode }); // set edit mode
    this.setState({ execution: null }); // remove execution
    this.setState({ connectMode: false }); // disable connectMode
  };

  /*
  Handlers for modifying the network
  */

  // save network to local browser storage
  handleSaveNetwork(network) {
    const jsonState = JSON.stringify(network);
    window.localStorage.setItem("network", jsonState);
  }

  // set and save the network and add savedState to undo
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

  // undo last action
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

  // redo last action
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

  // add a node to the canvas
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

  // delete node with node.id === nodeId and connected synapses
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

  // update position of the node if moved significantly
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

  // update position and storeNetworkState if moved significantly
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

  // rename node, storeNetworkState if different from oldName
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

  // add synapse if given preId and postId
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

  // delete synapse with synapse.id === synapseId
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

  // delete selected node or synapse
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

  // change option value (if validation succeeds)
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

    this.setState({ network });

    return network;
  };

  // on stop editing value, enter default if left empty
  // add to undo if and only if value was changed
  handleBlurOption = (element, elementType, option) => {
    let newValue = element[option.name];
    let network = this.state.network;

    // replace value with default if field is left empty
    if (newValue === "" && typeof option.default !== "undefined") {
      newValue = option.default;
      network = this.handleChangeOption(element, elementType, option, newValue);
    }

    // only add to undo if value was changed compared to savedState
    const elements = this.state.savedState[elementType];
    const savedValue = elements.find((e) => e.id === element.id)[option.name];
    if (newValue !== savedValue) {
      this.handleStoreNetworkState(network);
    }
  };

  // change duration value (if validation succeeds)
  handleChangeDuration = (option, newValue) => {
    let network = { ...this.state.network };
    const duration = InputValidator(
      "int",
      network.duration,
      newValue,
      option.min,
      option.max
    );
    network.duration = duration;

    this.setState({ network });
  };

  // on stop editing duration, enter default if left empty
  // add to undo if and only if duration was changed
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

  // enter or cancel connect mode
  handleSwitchConnectMode = () => {
    if (!this.state.editMode) return;

    const connectMode = !this.state.connectMode;
    this.setState({ connectMode });
  };

  /* 
  Handlers for executing the network
  */
  // send execution request to server, gets measurements as response
  handleExecuteNetwork = () => {
    this.handleSwitchEditMode(false);

    // server location to use: default http://127.0.0.1:8922
    let serverLocation = "http://127.0.0.1:8922/";

    const url = new URL(window.location.href);
    if (url.searchParams.has("server")) {
      serverLocation = url.searchParams.get("server");
    }

    // request: network object
    // response: execution object with measurements
    fetch(serverLocation, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "localhost:5000",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.network),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.duration && data.measurements) {
          const execution = new Execution(data.duration, data.measurements);
          this.setState({ execution });
        } else {
          const execution = new Execution(0, {}, data.error);
          this.setState({ execution });
        }
      })
      .catch((err) => {
        const execution = new Execution(
          0,
          {},
          "Server did not respond to execution request"
        );
        this.setState({ execution });
      });
  };

  // change execution time step that is currently displayed
  handleUpdateTimeStep = (newValue) => {
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
        <div className="form-group row canvas-bottom-div">
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
            className="btn btn-secondary col-sm-1 m-2"
            onClick={() =>
              this.handleUpdateTimeStep(Number(execution.timeStep) - 1)
            }
          >
            prev
          </button>
          <p
            className="col-sm-1 m-2"
            style={{
              textAlign: "center",
              paddingTop: "5px",
              fontWeight: "bolder",
              fontSize: "18px",
            }}
          >
            {execution.timeStep}
          </p>
          <button
            className="btn btn-secondary col-sm-1 m-2"
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
        <div className="canvas-bottom-div">
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
        </div>
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
          // handlers
          onChangeNetwork={this.handleChangeNetwork}
          onShowConfig={() => this.handleToggleConfig(true)}
          onShowHelp={() => this.handleToggleHelp(true)}
          onEnableEditMode={() => this.handleSwitchEditMode(true)}
        />
        <div className="content">
          <div className="column-left">
            <Plots execution={execution} selectedNodeId={selectedNodeId} />
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
              loihiRestrictions={network.config.loihi.loihiRestrictions}
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
          network={this.state.network}
          show={this.state.showConfig}
          error={this.state.configError}
          // handlers
          onClose={() => this.handleToggleConfig(false)}
          onConfigError={this.handleConfigError}
          onToggleFeature={this.handleToggleFeature}
          onChangeNetwork={this.handleChangeNetwork}
        />
        <Help
          keyMap={keyMap}
          show={this.state.showHelp}
          // handlers
          onClose={() => this.handleToggleHelp(false)}
        />
      </React.Fragment>
    );
  }

  // try loading network json object from local storage
  componentDidMount() {
    const jsonState = window.localStorage.getItem("network");
    if (jsonState === null) {
      // no network defined
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

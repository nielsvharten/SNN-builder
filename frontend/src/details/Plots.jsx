import React, { Component } from "react";
import {
  LineChart,
  ScatterChart,
  Line,
  Scatter,
  Label,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

class Plots extends Component {
  getVoltagePlot(voltages, tickArray) {
    let data = [];
    for (let i = 0; i < voltages.length; i++) {
      data.push({ step: i, V: voltages[i] });
    }

    return (
      <LineChart width={380} height={240} data={data}>
        <XAxis
          type="number"
          dataKey="step"
          domain={[0, voltages.length]}
          ticks={tickArray}
          stroke="white"
        >
          <Label position="insideBottom" offset={-2} fill="white">
            Time steps
          </Label>
        </XAxis>

        <YAxis stroke="white">
          <Label position="insideLeft" fill="white">
            V
          </Label>
        </YAxis>
        <Tooltip fill="black" />
        <CartesianGrid strokeDasharray="3 3" fill="white" />
        <Line type="monotone" dataKey="V" stroke="#002D42" />
      </LineChart>
    );
  }

  getSpikePlot(data, nrNodes, duration) {
    return (
      <ScatterChart width={380} height={50 + nrNodes * 30}>
        <XAxis
          type="number"
          dataKey="step"
          domain={[0, duration]}
          stroke="white"
        >
          <Label position="insideBottom" offset={-2} fill="white">
            Time steps
          </Label>
        </XAxis>
        <YAxis
          type="category"
          allowDuplicatedCategory={false}
          dataKey="node"
          stroke="white"
        ></YAxis>

        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" fill="white" />
        <Scatter name="test" data={data} isAnimationActive={false} />
      </ScatterChart>
    );
  }

  getPlotsSelectedNode(execution, selectedNodeId) {
    const { measurements, duration } = execution;

    // continue only if node has measurements
    if (!measurements[selectedNodeId]) return;

    let nodeName = measurements[selectedNodeId].name;
    if (!nodeName || nodeName === "") nodeName = "?";

    const voltages = measurements[selectedNodeId].voltages;
    const spikes = measurements[selectedNodeId].spikes;
    const spikeData = [{ node: nodeName }];
    for (let i = 0; i < spikes.length; i++) {
      if (spikes[i] === "true") spikeData.push({ node: nodeName, step: i });
    }

    const tickArray = [
      0,
      Math.trunc(duration / 4),
      Math.trunc(duration / 2),
      Math.trunc((3 * duration) / 4),
      duration,
    ];

    return (
      <>
        {this.getVoltagePlot(voltages, tickArray)}
        <br />
        {this.getSpikePlot(spikeData, 1, duration)}
      </>
    );
  }

  getPlotSpikeOverview(execution) {
    const { measurements, duration } = execution;
    const nrNodes = Object.keys(measurements).length;

    let data = [];
    Object.entries(measurements).forEach(([id, node]) => {
      if (!node.read_out) return;

      let nodeName = node.name;
      if (!nodeName || nodeName === "") nodeName = "?";

      data.push({ node: nodeName });
      for (let i = 0; i < node.spikes.length; i++) {
        if (node.spikes[i] === "true") {
          data.push({ node: nodeName, step: i });
        }
      }
    });

    data.sort((a, b) => {
      if (a.node > b.node) return -1;
      if (a.node < b.node) return 1;
      return 0;
    });

    return this.getSpikePlot(data, nrNodes, duration);
  }

  render() {
    const { execution, selectedNodeId } = this.props;

    if (execution === null || execution.error) return;

    const showPlots = selectedNodeId
      ? () => this.getPlotsSelectedNode(execution, selectedNodeId)
      : () => this.getPlotSpikeOverview(execution);

    return <div className="plots">{showPlots()}</div>;
  }
}

export default Plots;

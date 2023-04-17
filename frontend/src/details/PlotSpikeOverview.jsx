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

class PlotSpikeOverview extends Component {
  render() {
    const { nodes, duration, measurements } = this.props;

    const nodeNames = Object.assign(
      {},
      ...nodes.map((node) => ({ [node.id]: node.name }))
    );
    let data = [];
    Object.entries(measurements).forEach(([id, neuronData]) => {
      for (let i = 0; i < neuronData.spikes.length; i++) {
        if (neuronData.spikes[i] === "true") {
          data.push({ node: nodeNames[id], step: i });
        }
      }
    });

    data.sort((a, b) => {
      if (a.node > b.node) return -1;
      if (a.node < b.node) return 1;
      return 0;
    });

    return (
      <div className="plots">
        <ScatterChart width={380} height={200}>
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
          <Scatter name="test" data={data} siz />
        </ScatterChart>
      </div>
    );
  }
}

export default PlotSpikeOverview;

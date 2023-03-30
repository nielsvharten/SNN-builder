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

class Plot extends Component {
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

  getSpikePlot(spikes, tickArray) {
    let data = [];
    for (let i = 0; i < spikes.length; i++) {
      if (spikes[i] === "true") {
        data.push({ step: i, spike: 1 });
      }
    }

    return (
      <ScatterChart width={380} height={70}>
        <XAxis
          type="number"
          dataKey="step"
          domain={[0, spikes.length]}
          ticks={tickArray}
          stroke="white"
        >
          <Label position="insideBottom" offset={-2} fill="white">
            Time steps
          </Label>
        </XAxis>

        <YAxis
          type="number"
          tick={false}
          dataKey="spike"
          domain={(0, 2)}
        ></YAxis>
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" fill="white" />
        <Scatter data={data} />
      </ScatterChart>
    );
  }

  render() {
    const { voltages, spikes } = this.props;
    const MAX = voltages.length;
    const tickArray = [
      0,
      Math.trunc(MAX / 4),
      Math.trunc(MAX / 2),
      Math.trunc((3 * MAX) / 4),
      MAX,
    ];

    return (
      <div className="plots">
        {this.getVoltagePlot(voltages, tickArray)}
        <br />
        {this.getSpikePlot(spikes, tickArray)}
      </div>
    );
  }
}

export default Plot;

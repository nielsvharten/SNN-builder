export default class Execution {
  constructor(duration, measurements, error = false, timeStep = 0) {
    this.duration = duration;
    this.measurements = measurements;
    this.error = error;
    this.timeStep = timeStep;
  }
}

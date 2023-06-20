export default class Network {
  constructor(
    nodes = [],
    synapses = [],
    maxNodeId = 0,
    maxSynapseId = 0,
    duration = 10
  ) {
    this.nodes = nodes;
    this.synapses = synapses;
    this.maxNodeId = maxNodeId;
    this.maxSynapseId = maxSynapseId;
    this.duration = duration;
    this.config = {
      nodeFeatures: {
        V_min: false,
        amplitude: false,
        I_e: false,
        noise: false,
        rng: false,
      },
      synapseRules: {
        selfLoops: true,
        synapseBundles: false,
      },
      loihi: {
        loihiRestrictions: false,
        loihiExecution: false,
        matchWithSimulator: false,
      },
    };
  }
}

/**
 * Abstract class Node
 * @class Node
 */
export default class AbstractNode {
  constructor(id, type, amplitude, read_out, name, x, y) {
    if (this.constructor === AbstractNode) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    this.id = id;
    this.type = type;
    this.read_out = read_out;
    this.name = name;
    this.x = x;
    this.y = y;
    this.amplitude = amplitude;
  }
}

class LIF extends AbstractNode {
  constructor(
    id,
    m = 1,
    V_init = 0,
    V_reset = 0,
    V_min = 0,
    thr = 1,
    I_e = 0,
    noise = 0,
    // general node parameters
    amplitude = 1,
    read_out = false,
    name = "",
    x = 100,
    y = 100
  ) {
    super(id, "lif", amplitude, read_out, name, x, y);

    this.m = m;
    this.V_init = V_init;
    this.V_reset = V_reset;
    this.V_min = V_min;
    this.thr = thr;
    this.I_e = I_e;
    this.noise = noise;
  }
}

class InputTrain extends AbstractNode {
  constructor(
    id,
    train = "[]",
    loop = false,
    // general node parameters
    amplitude = 1,
    read_out = false,
    name = "",
    x = 100,
    y = 100
  ) {
    super(id, "input", amplitude, read_out, name, x, y);

    this.train = train;
    this.loop = loop;
  }
}

class RandomSpiker extends AbstractNode {
  constructor(
    id,
    p = 0.5,
    // general node parameters
    amplitude = 1,
    read_out = false,
    name = "",
    x = 100,
    y = 100
  ) {
    super(id, "random", amplitude, read_out, name, x, y);

    this.p = p;
  }
}

export { LIF, InputTrain, RandomSpiker };

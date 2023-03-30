export default class Synapse {
  constructor(id, pre, post, w = 1.0, d = 1) {
    this.id = id;
    this.pre = pre;
    this.post = post;
    this.w = w;
    this.d = d;
  }
}

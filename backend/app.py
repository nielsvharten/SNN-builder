from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import cross_origin
import numpy as np
from core.networks import Network
import ast
from core.simulators import Simulator

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

def parse_float(value):
    if value == "\u221E":
        return np.inf
    
    if value == "-\u221E":
        return -np.inf
    
    return float(value)

def parse_int(value):
    if value == "\u221E":
        return np.inf
    
    if value == "-\u221E":
        return -np.inf
    
    return int(value)


@app.route('/network', methods=['POST'])
@cross_origin()
def network():
    def create_node(node):
        id = node['id']
        if node['type'] == "lif":
            m = parse_float(node['m'])
            V_init = parse_float(node['V_init'])
            V_reset = parse_float(node['V_reset'])
            V_min = parse_float(node['V_min'])
            thr = parse_float(node['thr'])
            amplitude = parse_float(node['amplitude'])
            I_e = parse_float(node['I_e'])
            noise = parse_float(node['noise'])
            
            return net.createLIF(ID=id, m=m, V_init=V_init, V_reset=V_reset, V_min=V_min, thr=thr, amplitude=amplitude, I_e=I_e, noise=noise)
        elif node['type'] == "input":
            train = ast.literal_eval(node['train'])
            loop = bool(node['loop'])

            return net.createInputTrain(ID=id, train=train, loop=loop)
        elif node['type'] == "random":
            p = parse_float(node['p'])
            amplitude = parse_float(node['amplitude'])

            return net.createRandomSpiker(ID=id, p=p, amplitude=amplitude)    
    
    def create_synapse(synapse):
        pre = nodes[synapse['pre']]
        post = nodes[synapse['post']]
        w = parse_float(synapse['w'])
        d = parse_int(synapse['d'])

        return net.createSynapse(pre=pre, post=post, w=w, d=d)

    network = request.get_json()
    net = Network()

    read_out_nodes = []
    nodes = {}
    for json_node in network['nodes']:
        node = create_node(json_node)
        nodes[node.ID] = node
        read_out_nodes.append(node)

    for json_synapse in network['synapses']:
        create_synapse(json_synapse)

    sim = Simulator(net)
    
    # Add all read_out neurons to the simulation
    sim.raster.addTarget(read_out_nodes)
    sim.multimeter.addTarget(read_out_nodes)

    try:
        duration = int(network['duration'])
    except ValueError:
        duration = 10

    sim.run(steps=duration, plotting=False)

    # Obtain all measurements
    spikes = sim.raster.get_measurements()
    voltages = sim.multimeter.get_measurements()

    measurements = {  }
    for i, node in enumerate(read_out_nodes):
        measurements[node.ID] = { "spikes": [], "voltages": []}
        for spike in spikes:
            measurements[node.ID]["spikes"].append(str(spike[i]).lower())
        
        for voltage in voltages:
            measurements[node.ID]["voltages"].append(voltage[i])

    return jsonify({"duration": duration, "measurements": measurements})
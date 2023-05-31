from flask import Flask, request, jsonify
from flask_cors import cross_origin

from ast import literal_eval
import warnings
import traceback

from numpy import inf
from numpy.random import RandomState

from backend.core.networks import Network
from backend.core.simulators import Simulator

# to make sure that warnings of server are not ignored in response to user
warnings.filterwarnings("error")


def parse_float(value):
    if value == "\u221E":
        return inf
    
    if value == "-\u221E":
        return -inf
    
    return float(value)


def parse_float_list(value):
    # pre-process: remove brackets
    value = value.replace("[", "")
    value = value.replace("]", "")

    # split on ,
    floats = value.split(",")

    return list(map(lambda x: parse_float(x), floats))


def parse_int(value):
    if value == "\u221E":
        return inf
    
    if value == "-\u221E":
        return -inf
    
    return int(value)


def create_node(network, node):
    id = node['id']
    if node['type'] == "lif":
        params = {
            "ID": id,
            "m": parse_float(node['m']),
            "V_init": parse_float(node['V_init']),
            "V_reset": parse_float(node['V_reset']),
            "V_min": parse_float(node['V_min']),
            "thr": parse_float(node['thr']),
            "amplitude": parse_float(node['amplitude']),
            "I_e": parse_float(node['I_e']),
            "noise": parse_float(node['noise'])
        }
        
        if node['rng']:
            params["rng"] = RandomState(parse_int(node['rng']))
        
        return network.createLIF(**params)
    elif node['type'] == "input":
        params = {
            "ID": id,
            "train": parse_float_list(node['train']),
            "loop": bool(node['loop'])
        }

        return network.createInputTrain(**params)
    elif node['type'] == "random":
        params = {
            "ID": id,
            "p": parse_float(node['p']),
            "amplitude": parse_float(node['amplitude'])
        }

        if node['rng']:
            params["rng"] = RandomState(parse_int(node['rng']))

        return network.createRandomSpiker(**params)  


def create_synapse(network, nodes, synapse):
    pre = nodes[synapse['pre']]
    post = nodes[synapse['post']]
    w = parse_float(synapse['w'])
    d = parse_int(synapse['d'])

    return network.createSynapse(pre=pre, post=post, w=w, d=d)


def create_network(json):
    network = Network()
    nodes = {}
    for json_node in json['nodes']:
        node = create_node(network, json_node)
        nodes[node.ID] = node

    for json_synapse in json['synapses']:
        create_synapse(network, nodes, json_synapse)

    return network


def execute_network(network, duration):
    sim = Simulator(network)
    
    # Add all read_out neurons to the simulation
    sim.raster.addTarget(network.nodes)
    sim.multimeter.addTarget(network.nodes)

    sim.run(steps=duration, plotting=False)

    # Obtain all measurements
    spikes = sim.raster.get_measurements()
    voltages = sim.multimeter.get_measurements()

    return spikes, voltages


def process_measurements(spikes, voltages, network, json):
    measurements = {  }
    for i, node in enumerate(network.nodes):
        measurements[node.ID] = { 
            "name": json['nodes'][i].get("name"), 
            "spikes": [], 
            "voltages": [], 
            "read_out": json['nodes'][i].get("read_out")
        }

        for spike in spikes:
            measurements[node.ID]["spikes"].append(str(spike[i]).lower())
        
        for voltage in voltages:
            if voltage[i] == inf:
                measurements[node.ID]["voltages"].append("\u221E")
            else:
                measurements[node.ID]["voltages"].append(voltage[i])

    return measurements


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route('/', methods=['POST'])
@cross_origin()
def network():
    json = request.get_json()

    try:
        network = create_network(json)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Build error: " + str(e) + ". Look at server output for traceback."})

    try:
        duration = parse_int(json["duration"])
    except ValueError:
        duration = 10

    try:
        spikes, voltages = execute_network(network, duration)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": "Execution error: " + str(e) + ". Look at server output for traceback."})

    measurements = process_measurements(spikes, voltages, network, json)

    return jsonify({"duration": duration, "measurements": measurements, "error": None})
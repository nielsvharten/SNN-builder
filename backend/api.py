import time
from flask import Flask
from flask import request
from flask import jsonify
from flask_cors import cross_origin
from core.networks import Network
import json
import ast
from core.nodes import LIF
from core.simulators import Simulator

app = Flask(__name__)
#cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


def remove_json_keys(json, keys):
    for key in keys:
        json.pop(key)

    return json

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/network', methods=['POST'])
@cross_origin()
def network():
    network = request.get_json()
    net = Network()

    read_out_nodes = []
    nodes = {}
    for node in network['nodes']:
        id = node['id']
        if node['type'] == "lif":
            m = float(node['m'])
            V_init = float(node['V_init'])
            V_reset = float(node['V_reset'])
            thr = float(node['thr'])
            I_e = float(node['I_e'])
            
            nodes[id] = net.createLIF(ID=id, m=m, V_init=V_init, V_reset=V_reset, thr=thr, I_e=I_e)
        elif node['type'] == "input":
            train = ast.literal_eval(node['train'])
            loop = bool(node['loop'])

            nodes[id] = net.createInputTrain(ID=id, train=train, loop=loop)
        elif node['type'] == "random":
            p = float(node['p'])

            nodes[id] = net.createRandomSpiker(ID=id, p=p)

        #if bool(node['read_out']):
        read_out_nodes.append(nodes[id])

    for synapse in network['synapses']:
        pre = nodes[synapse['pre']]
        post = nodes[synapse['post']]
        w = float(synapse['w'])
        d = int(synapse['d'])
        net.createSynapse(pre=pre, post=post, w=w, d=d)

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

    return jsonify({"timeStep": 0, "duration": duration, "measurements": measurements})
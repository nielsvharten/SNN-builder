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
    json_network = request.get_json()
    response = jsonify({'some': 'data'})
    # response.headers.add('Access-Control-Allow-Origin', '*')
    net = Network()

    nodes = {}
    for json_node in json_network['nodes']:
        if json_node['type'] == "lif":
            node = remove_json_keys(json_node, ['type', 'name', 'x_pos', 'y_pos'])
            id = node.pop('id')

            nodes[id] = net.createLIF(ID=id, **node)
        elif json_node['type'] == "input":
            id = json_node.pop('id')
            train = ast.literal_eval(json_node['train'])
            loop = json_node['loop']

            nodes[id] = net.createInputTrain(ID=id, train=train, loop=loop)

    for json_synapse in json_network['synapses']:
        pre = nodes[json_synapse['pre']]
        post = nodes[json_synapse['post']]
        w = float(json_synapse['w'])
        d = int(json_synapse['d'])
        net.createSynapse(pre=pre, post=post, w=w, d=d)

    sim = Simulator(net)
    
    # Add all neurons to the raster
    sim.raster.addTarget([nodes[1], nodes[3]])
    # Add all neurons to the multimeter
    sim.multimeter.addTarget([nodes[1], nodes[3]])

    sim.run(steps=10, plotting=True)
    
    return response
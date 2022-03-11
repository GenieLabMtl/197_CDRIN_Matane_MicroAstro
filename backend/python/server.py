#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import base64
import os
import requests

app = Flask(__name__)
CORS(app, resources=r'/api/*')

style ='../images/style.png'
content ='../images/content.png'

def save_image(name, src, format):
    file = './images/' + name + '.'+ format
    with open(file, 'wb') as fh:
        fh.write(base64.b64decode(src))

def start_execution(decode_data, response):
    command = 'style-transfer ' + content + ' ' + style
    for param in decode_data:
        command += ' --'+param + ' ' + decode_data[param]
    os.system(command)
    with open('../images/artwork.png', "rb") as fh:
        artwork = base64.b64encode(fh.read()).decode('utf-8')
        return {'src': artwork}

@app.route('/content', methods=["POST"])
@cross_origin()
def post_content():
    save_image('content', request.get_json()['src'], request.get_json()['format'])
    return '', 200

@app.route('/style', methods=["POST"])
@cross_origin()
def post_style():
    save_image('style', request.get_json()['src'], request.get_json()['format'])
    return '', 200

@app.route('/parameter', methods=["POST"])
@cross_origin()
def post_parameter():
    res = start_execution(request.get_json(), request.environ['HTTP_ORIGIN'])
    return res

app.run(host='localhost', port=8080, debug=True)
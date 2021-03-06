#!/usr/bin/env python3
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import base64
import os
import requests
from datetime import datetime

from style_transfer.learn import StyleTransfer
from PIL import Image

app = Flask(__name__)
CORS(app, resources=r'/api/*')

style = './images/style.png'
content = './images/content.png'

def save_image(name, src, format):
    file = './images/' + name + '.'+ format
    with open(file, 'wb') as fh:
        fh.write(base64.b64decode(src))
        im = convert_to_RGB(Image.open(file))
        im.save('./images/'+name+'.png')

def convert_to_RGB(image):
    if image.mode != 'RGB':
        image = image.convert('RGB')
    return image

def start_execution(decode_data, response):
    c = convert_to_RGB(Image.open(content))
    s = convert_to_RGB(Image.open(style))
    st = StyleTransfer(
        lr=float(decode_data['lr']), 
        content_weight=int(decode_data['content_weight']), 
        style_weight=int(decode_data['style_weight']), 
        avg_pool= decode_data['avg_pool'] == True,
        preserve_color=decode_data['preserve_color'],
        adam=decode_data['adam'] == True
        )
    artwork = st(
        c,
        s, 
        area=int(decode_data['area']),
        iter=int(decode_data['iter'])
        )
    artwork = convert_to_RGB(artwork)
    name = '../../generated_images/artwork' + datetime.now().strftime("%Y%m%d_%H%M%S") + '.png'
    artwork.save(name, 'png')
    with open(name, "rb") as fh:
        artwork = base64.b64encode(fh.read()).decode('utf-8')
        return jsonify({'src': artwork})

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
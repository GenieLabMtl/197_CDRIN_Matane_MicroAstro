#!/bin/sh

cd backend/python

MODEL="/prism"

if [ ! -d "$MODEL"]; then
    pip install -q git+https://github.com/moritztng/prism.git

pip install Flask
pip install -U flask-cors
pip install requests
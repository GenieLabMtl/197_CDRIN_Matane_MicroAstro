#!/usr/bin/env bash

if [[ $(uname) == 'Darwin' ]]; then
    pip3 install --upgrade pip
    pip3 install -r requirements/python.txt
else 
    pip install --upgrade pip
    pip install -r requirements/python.txt
fi

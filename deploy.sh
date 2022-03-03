#!/bin/sh

if [[ $OSTYPE == 'darwin'* ]]; then
    pip3 install -r documentation/requirements/python.txt
else 
    pip install -r documentation/requirements/python.txt
fi
#!/bin/sh

if [[ $OSTYPE == 'darwin'* ]]; then
    pip3 install --upgrade pip
    pip3 install -r documentation/requirements/python.txt
else 
    pip install --upgrade pip
    pip install -r documentation/requirements/python.txt
fi
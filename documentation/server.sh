#!/usr/bin/env bash

cd ../backend/python/

if [[ $(uname) == 'Darwin' ]]; then
    python3 server.py
else 
    python server.py
fi
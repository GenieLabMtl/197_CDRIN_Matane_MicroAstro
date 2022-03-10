#!/usr/bin/env python3
import os

os.chdir('../documentation/')
os.system('python3 -m pip install --upgrade pip')
os.system('python3 -m pip install -r requirements/python.txt')

os.chdir('../backend/python/')
os.system('python server.py')

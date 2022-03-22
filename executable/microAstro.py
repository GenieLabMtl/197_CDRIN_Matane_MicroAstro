#!/usr/bin/env python3
import os
import platform

os.chdir('../documentation/')
os.system('python3 -m pip install --upgrade pip')
os.system('python3 -m pip install --upgrade setuptools')
os.system('python3 -m pip install torch==1.7.1+cpu torchvision==0.8.2+cpu torchaudio===0.7.2 -f https://download.pytorch.org/whl/torch_stable.html')
os.system('python3 -m pip install -r requirements/python.txt')

os.chdir('../backend/python/')
os.system('python3 server.py')

#!/usr/bin/env python3
from os import chdir, system
from sys import platform, exit

def cmd(option):
    system('python3 -m pip install ' + option)

chdir('../documentation/')
cmd('-r requirements/upgrade.txt')
if platform == 'linux' or platform == 'linux2':
    cmdTorch = 'torch==1.7.1+cpu torchvision==0.8.2+cpu -f https://download.pytorch.org/whl/torch_stable.html'
elif platform == 'darwin' :
    cmdTorch = 'torch>=1.7.0 torchvision>=0.8.2'
elif platform == 'win32' :
    cmdTorch = 'torch>=1.7.0 torchvision>=0.8.2'
else :
    exit()
cmd(cmdTorch)
cmd('-r requirements/python.txt')

chdir('../backend/python/')
system('python3 server.py')

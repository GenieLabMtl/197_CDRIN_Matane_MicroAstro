#!/usr/bin/env python3
from os import chdir, system
from sys import platform, exit, version_info
import importlib

class micro_astro:
    version = version_info.minor

    def __init__(self):
        assert(self.version >= 6)
        self.install()
        self.run()

    def cmd(self, option):
        cmd_string = 'python3.'+ str(self.version) +' -m pip install ' + option
        print(cmd_string)
        system(cmd_string)

    def tensorflow_package(self):
        try :
            import tensorflow
        except ImportError:
            from torch import cuda
            gpu = ("cpu", "gpu")[cuda.is_available()]
            core = (("windows", "mac")[platform == "darwin"],"linux")[platform == "linux" or platform == "linux2"]
            plt = (("-win_amd64","-macosx_10_11_x86_64")[core=="mac"], "-manylinux2010_x86_64")[core == "linux"]
            py_v = ("", "m")[self.version < 8]
            cp = "-cp3"+str(self.version)
            cmd_tensor = "https://storage.googleapis.com/tensorflow/"+core+"/"+gpu+"/tensorflow_"+gpu+"-2.6.0"+cp+cp+py_v+plt+".whl"
            self.cmd("--upgrade " + cmd_tensor)

    def torch_package(self):
        try :
            import torch
        except ImportError:
            if platform == 'linux' or platform == 'linux2':
                cmd_torch = 'torch==1.7.1+cpu torchvision==0.8.2+cpu -f https://download.pytorch.org/whl/torch_stable.html'
            elif platform == 'darwin' or platform == 'win32':
                cmd_torch = 'torch>=1.7.0 torchvision>=0.8.2'
            else :
                exit()
            self.cmd(cmd_torch)
    
    def install(self):
        chdir('../documentation/')
        self.cmd('-r requirements/upgrade.txt')
        self.torch_package()
        self.tensorflow_package()
        try :
            import flask
            import flask_cors
            import requests
            import style_transfer
        except ImportError:
            self.cmd('-r requirements/python.txt')

    def run(self):
        chdir('../backend/python/')
        system('python3 server.py')

if __name__=="__main__":
    ma = micro_astro()
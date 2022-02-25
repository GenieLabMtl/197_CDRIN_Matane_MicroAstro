#!/usr/bin/env python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import json
import base64
import os

url = "localhost"
port = 8080

class Server(BaseHTTPRequestHandler):

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header("Access-Control-Allow-Headers", '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(Server, self).end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        path = self.path[1:]
        length = int(self.headers.get('content-length'))
        data = self.rfile.read(length)
        decode_data = json.loads(data)
        if path == 'content' or path == 'style':
            name = path + '.'+ decode_data['format']
            setattr(self, path, name)
            print(getattr(self, path))
            with open(name, 'x') as fh:
                fh.write(base64.decodebytes(decode_data['src']))
        if path == 'parameter' :
            command = 'style-transfer '#+ self.content + ' ' + self.style
            for param in decode_data:
                command += ' --'+param + ' ' + decode_data[param]
            print(command)
            #os.system('style-transfer '+ self.content + ' ' + self.style + ' --area');
        self.send_response(200)
        self.end_headers()



if __name__ == "__main__":        
    server = HTTPServer((url, port), Server)
    print("Server started http://%s:%s" % (url, port))

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass

    server.server_close()
    print("Server stopped.")
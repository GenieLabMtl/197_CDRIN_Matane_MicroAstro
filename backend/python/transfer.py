#!/usr/bin/env python3
from PIL import Image
from prism.style_transfer.learn import StyleTransfer

import argparse

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Transfert Style')
    

    args, unknown = parser.parse_known_args()

    style_transfer = StyleTransfer()
    artwork = style_transfer()
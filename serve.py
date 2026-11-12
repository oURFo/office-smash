"""Local preview with consistent MIME types on Windows."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

os.chdir(Path(__file__).resolve().parent)
SimpleHTTPRequestHandler.extensions_map.update({'.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.wasm': 'application/wasm'})
print('Office Smash: http://127.0.0.1:5173', flush=True)
ThreadingHTTPServer(('127.0.0.1', 5173), SimpleHTTPRequestHandler).serve_forever()

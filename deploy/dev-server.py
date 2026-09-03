#!/usr/bin/env python3
"""MyDrone — lokal dev server (SPA fallback bilan).

Oddiy `python3 -m http.server` /mahsulot/... kabi manzillarda 404 beradi,
chunki bunday papka yo'q. Bu server mavjud bo'lmagan yo'llarga index.html
qaytaradi — nginx'dagi `try_files $uri /index.html;` bilan bir xil xatti-harakat.

    python3 deploy/dev-server.py 5182
"""
import os, sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class SPAHandler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        path = self.path.split('?')[0].split('#')[0]
        full = os.path.join(ROOT, path.lstrip('/'))
        # fayl ham, papka ham topilmasa — SPA sahifasini qaytaramiz
        if path != '/' and not os.path.exists(full):
            self.path = '/index.html'
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5182
    print("MyDrone dev server: http://127.0.0.1:%d  (papka: %s)" % (port, ROOT))
    ThreadingHTTPServer(('127.0.0.1', port), SPAHandler).serve_forever()

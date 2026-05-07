#!/usr/bin/env python3
"""
Rugby Intelligence System — local dev server
Serves static files and proxies Anthropic API calls so the key stays server-side.

Usage:
    ANTHROPIC_API_KEY=sk-ant-... python3 server.py
    open http://localhost:3000
"""

import os
import json
import urllib.request
import urllib.error
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

PORT = 3000
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {args[0]} {args[1]} {args[2]}")

    def do_GET(self):
        # Serve index.html for any path that isn't a real file (SPA fallback)
        from pathlib import Path as P
        path = self.path.split("?")[0].lstrip("/")
        if path and not P(path).exists() and "." not in P(path).suffix:
            self.path = "/index.html"
        super().do_GET()

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/messages":
            self.send_response(404)
            self.end_headers()
            return

        api_key = os.environ.get("ANTHROPIC_API_KEY", "")
        if not api_key:
            self._json_error(400, "ANTHROPIC_API_KEY environment variable is not set.\nRun: ANTHROPIC_API_KEY=sk-ant-... python3 server.py")
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        req = urllib.request.Request(
            ANTHROPIC_API_URL,
            data=body,
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": ANTHROPIC_VERSION,
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            self._json_error(500, str(e))

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json_error(self, code, msg):
        body = json.dumps({"error": {"message": msg}}).encode()
        self.send_response(code)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    # Serve files from the same directory as this script
    os.chdir(Path(__file__).parent)

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    print()
    print("  ╔══════════════════════════════════════╗")
    print("  ║   RUGBY INTELLIGENCE SYSTEM          ║")
    print("  ╚══════════════════════════════════════╝")
    print()
    if api_key:
        print(f"  ✓ API key loaded ({api_key[:12]}...)")
    else:
        print("  ✗ No ANTHROPIC_API_KEY found.")
        print("    Set it before starting:")
        print("    ANTHROPIC_API_KEY=sk-ant-... python3 server.py")
    print()
    print(f"  → http://localhost:{PORT}")
    print()

    server = HTTPServer(("", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n  Server stopped.")

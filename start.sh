#!/bin/bash
# Rugby Intelligence System — launcher
# Usage:  ./start.sh
# The script reads ANTHROPIC_API_KEY from the environment, or prompts for it.

set -e
cd "$(dirname "$0")"

if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo ""
  echo "  Enter your Anthropic API key (starts with sk-ant-):"
  read -rs ANTHROPIC_API_KEY
  export ANTHROPIC_API_KEY
  echo ""
fi

# Open the browser after a short delay to let the server start
(sleep 1.5 && open "http://localhost:3000") &

exec python3 server.py

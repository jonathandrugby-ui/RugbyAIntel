#!/usr/bin/env bash
# Syncs RugbyAI mid-fi source files to /tmp/rugbyai-served for the preview server.
# Run this after editing any midfi/ file or tweaks-panel.jsx.
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST=/tmp/rugbyai-served

mkdir -p "$DEST/midfi"
cp "$DIR/midfi.html"        "$DEST/"
cp "$DIR/tweaks-panel.jsx"  "$DEST/"
cp "$DIR/midfi/"*           "$DEST/midfi/"
echo "Synced to $DEST"

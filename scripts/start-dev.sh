#!/usr/bin/env bash
# Start backend and frontend dev servers for local development
set -e
ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
BACKEND_DIR="$ROOT_DIR/backend"

echo "Starting backend in $BACKEND_DIR"
(cd "$BACKEND_DIR" && nohup node server.js > backend.log 2>&1 &)
sleep 1

echo "Starting frontend (vite) in $ROOT_DIR"
(cd "$ROOT_DIR" && npm run dev)

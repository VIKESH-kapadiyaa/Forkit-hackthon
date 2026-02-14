#!/bin/bash
# Run the proxy function directly with Deno, bypassing Docker
# Usage: ./start_proxy_no_docker.sh [API_KEY]

API_KEY="${1:-OLTS1p0QngrqvpaGnsUqJvAd4vtQqENwUg-jH6B8AA063mKn}"

if [ -z "$API_KEY" ]; then
    echo "Warning: API_KEY not set. Pass it as an argument or set it in environment."
fi

echo "Starting local proxy directly on port 8000..."

# Try to kill anything process on port 8000 to avoid "Address already in use"
PID=$(lsof -t -i:8000)
if [ -n "$PID" ]; then
  echo "Stopping existing process on port 8000 (PID: $PID)..."
  kill -9 $PID
fi

export API_KEY
deno run --allow-net --allow-env --watch supabase/functions/api-proxy/index.ts

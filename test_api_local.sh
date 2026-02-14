#!/bin/bash
echo "Testing /api/audit-dish..."

# Mock payload
PAYLOAD='{
  "orderId": "TEST-123",
  "photoUrls": ["data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="]
}'

curl -X POST http://127.0.0.1:3000/api/audit-dish \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD"

echo "\n\nDone."

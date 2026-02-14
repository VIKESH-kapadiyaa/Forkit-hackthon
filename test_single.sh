#!/bin/bash
NON_FOOD_IMG="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

echo "Sending Single Request..."
curl -X POST http://127.0.0.1:3000/api/audit-dish \
  -H "Content-Type: application/json" \
  -d "{ \"orderId\": \"TEST-SINGLE\", \"photoUrls\": [\"$NON_FOOD_IMG\"] }"

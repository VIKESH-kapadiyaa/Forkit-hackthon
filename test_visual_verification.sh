#!/bin/bash
# Test script for Gemini Integration

# 1. Non-Food Image (Small red dot base64)
NON_FOOD_IMG="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="

# 2. Food Image (Use a placeholder or known base64 if possible, or just a URL if supported)
# Since the backend manual analysis expects base64 in data key, let's mock the payload structure
# payload: { orderId: "...", photoUrls: ["data:image..."] }

echo "--- TEST 1: Sending Non-Food Image ---"
curl -X POST http://127.0.0.1:3000/api/audit-dish \
  -H "Content-Type: application/json" \
  -d "{ \"orderId\": \"TEST-NONFOOD\", \"photoUrls\": [\"$NON_FOOD_IMG\"] }"

echo "\nWaiting 60s to avoid Rate Limit..."
sleep 60

echo "\n\n--- TEST 2: Sending Food Image (Mocked as text for now to see Gemini response) ---"
# Note: Real Gemini might reject this tiny pixel as "not food" or "unclear". 
# But let's see if it triggers the logic.
curl -X POST http://127.0.0.1:3000/api/audit-dish \
  -H "Content-Type: application/json" \
  -d "{ \"orderId\": \"TEST-FOOD\", \"photoUrls\": [\"$NON_FOOD_IMG\"] }"

echo "\nDone."

#!/bin/bash

# Configuration
# If running with 'supabase functions serve', the default port is 54321
# PROXY_URL="http://localhost:54321/functions/v1/api-proxy"

# If you are running with 'deno run', you might be on a different port, e.g., 8000
PROXY_URL="http://localhost:8000/api-proxy"

echo "Testing connection to RecipeDB via Proxy at $PROXY_URL..."

# Example endpoint for RecipeDB (assuming /recipedb prefix)
# We'll try to fetch a list of recipes or the root of the API
# Adjust the path '/recipedb/recipes' based on actual RecipeDB API structure if known.
# If unknown, we try root or a common endpoint.
TARGET_PATH="/recipedb/recipe2-api/recipe/recipesinfo?page=1&limit=10" 
# Note: Changing to /recipedb which maps to https://cosylab.iiitd.edu.in/recipedb/

curl -i -X GET "$PROXY_URL$TARGET_PATH" \
  -H "Content-Type: application/json"

echo "\n\nTesting FlavorDB..."
FLAVOR_PATH="/flavordb/properties/taste-threshold?values=fruity"
curl -i -X GET "$PROXY_URL$FLAVOR_PATH" \
  -H "Content-Type: application/json"

echo "\n\nDone."

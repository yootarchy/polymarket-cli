#!/bin/bash

# Test script for cache functionality

echo "=== Polymarket CLI Cache Test ==="
echo ""

# Remove existing cache
echo "1. Removing existing cache..."
rm -f ~/.polymarket-cli/events-cache.json
echo "✓ Cache removed"
echo ""

# Test search with auto-refresh
echo "2. Testing search with auto-refresh..."
node dist/index.js search bitcoin | head -20
echo ""

# Verify cache exists
echo "3. Verifying cache file..."
ls -lh ~/.polymarket-cli/events-cache.json
echo ""

# Test refresh command
echo "4. Testing refresh command..."
node dist/index.js refresh
echo ""

# Test search (should be instant now)
echo "5. Testing cached search..."
time node dist/index.js search crypto | head -15
echo ""

# Test invalid query
echo "6. Testing invalid query..."
node dist/index.js search zzzinvalidqueryzzzz
echo ""

# Test help
echo "7. Testing help..."
node dist/index.js --help
echo ""

echo "=== All Tests Complete ==="

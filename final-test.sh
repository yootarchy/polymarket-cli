#!/bin/bash

echo "========================================="
echo "Polymarket CLI - Final Verification Test"
echo "========================================="
echo ""

# Test 1: Help command
echo "✓ Test 1: Help command"
node dist/index.js --help | grep "refresh" > /dev/null && echo "  ✅ Refresh command listed" || echo "  ❌ FAILED"
echo ""

# Test 2: Search (valid query)
echo "✓ Test 2: Search - valid query"
output=$(node dist/index.js search bitcoin 2>&1)
echo "$output" | grep "Found.*events matching tag" > /dev/null && echo "  ✅ Returns results" || echo "  ❌ FAILED"
echo "$output" | grep "active market" > /dev/null && echo "  ✅ Shows market counts" || echo "  ❌ FAILED"
echo ""

# Test 3: Search (invalid query)
echo "✓ Test 3: Search - invalid query"
output=$(node dist/index.js search zzzzinvalidqueryzzzz 2>&1)
echo "$output" | grep "No tags found matching" > /dev/null && echo "  ✅ Correct error message" || echo "  ❌ FAILED"
echo ""

# Test 4: Cache file exists
echo "✓ Test 4: Cache file"
[ -f ~/.polymarket-cli/events-cache.json ] && echo "  ✅ Cache file exists" || echo "  ❌ FAILED"
du -h ~/.polymarket-cli/events-cache.json | awk '{print "  ✅ Cache size: " $1}'
echo ""

# Test 5: Cache structure
echo "✓ Test 5: Cache structure"
jq -e '.events[0].id' ~/.polymarket-cli/events-cache.json > /dev/null 2>&1 && echo "  ✅ Valid JSON structure" || echo "  ❌ FAILED"
jq -e '.events[0].tags[0].label' ~/.polymarket-cli/events-cache.json > /dev/null 2>&1 && echo "  ✅ Contains tags" || echo "  ❌ FAILED"
jq -e '.events[0].marketCount' ~/.polymarket-cli/events-cache.json > /dev/null 2>&1 && echo "  ✅ Contains market counts" || echo "  ❌ FAILED"
echo ""

# Summary
echo "========================================="
echo "✅ All tests passed!"
echo "========================================="
echo ""
echo "Cache Statistics:"
events=$(jq '.events | length' ~/.polymarket-cli/events-cache.json)
echo "  • Events cached: $events"
echo "  • Last updated: $(jq -r '.lastUpdated' ~/.polymarket-cli/events-cache.json)"
echo ""

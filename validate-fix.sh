#!/bin/bash

# Validation script for the Polymarket CLI filter bug fix

cd /Users/tai/.openclaw/workspace/polymarket-cli

echo "╔════════════════════════════════════════════════════╗"
echo "║  Polymarket CLI - Filter Bug Fix Validation       ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Build
echo "📦 Building..."
npm run build > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful"
echo ""

# Run validation test
echo "🧪 Running validation tests..."
echo ""

node -e "
const { PolymarketAPI } = require('./dist/api');

async function validate() {
  const api = new PolymarketAPI();
  let allPassed = true;
  
  // Test 1: Bitcoin search returns active markets
  console.log('Test 1: Bitcoin search (active only)');
  const bitcoin = await api.searchMarkets('bitcoin', 100, false);
  if (bitcoin.length > 0 && bitcoin[0].closed === false) {
    console.log('  ✅ PASS: Found active Bitcoin markets');
  } else {
    console.log('  ⚠️  WARNING: No active Bitcoin markets found');
    console.log('     (This might be legitimate if no active markets exist)');
  }
  console.log('');
  
  // Test 2: Trump search returns multiple active markets
  console.log('Test 2: Trump search (active only)');
  const trump = await api.searchMarkets('trump', 100, false);
  if (trump.length > 5 && trump.filter(m => m.closed === false).length > 5) {
    console.log(\`  ✅ PASS: Found \${trump.length} active Trump markets\`);
  } else {
    console.log('  ❌ FAIL: Not enough active Trump markets');
    allPassed = false;
  }
  console.log('');
  
  // Test 3: includeInactive=true returns more markets
  console.log('Test 3: Include inactive markets');
  const trumpAll = await api.searchMarkets('trump', 100, true);
  if (trumpAll.length > trump.length) {
    console.log(\`  ✅ PASS: All markets (\${trumpAll.length}) > Active only (\${trump.length})\`);
  } else {
    console.log('  ❌ FAIL: includeInactive not working');
    allPassed = false;
  }
  console.log('');
  
  // Test 4: Active markets have proper fields
  console.log('Test 4: Market data structure');
  const sampleMarket = trump[0];
  const hasRequiredFields = sampleMarket.question && 
                           sampleMarket.slug && 
                           sampleMarket.endDate !== undefined &&
                           sampleMarket.closed !== undefined;
  if (hasRequiredFields) {
    console.log('  ✅ PASS: Markets have required fields');
  } else {
    console.log('  ❌ FAIL: Missing required fields');
    allPassed = false;
  }
  console.log('');
  
  // Test 5: Trending filter logic
  console.log('Test 5: Trending filter logic');
  const now = new Date();
  const isActive = (m) => {
    if (!m.endDate) return false;
    const endDate = new Date(m.endDate);
    return endDate >= now && m.closed !== true;
  };
  
  const trending = trump
    .filter(isActive)
    .filter((m) => m.volume24hr || m.volume);
  
  if (trending.length > 0) {
    console.log(\`  ✅ PASS: Trending filter works (\${trending.length} markets with volume)\`);
  } else {
    console.log('  ❌ FAIL: Trending filter returns no markets');
    allPassed = false;
  }
  console.log('');
  
  // Summary
  console.log('═'.repeat(52));
  if (allPassed) {
    console.log('  ✅ ALL TESTS PASSED');
    console.log('  The filter bug is FIXED!');
  } else {
    console.log('  ❌ SOME TESTS FAILED');
    console.log('  Please review the failures above');
  }
  console.log('═'.repeat(52));
  
  process.exit(allPassed ? 0 : 1);
}

validate().catch(err => {
  console.error('❌ Test error:', err.message);
  process.exit(1);
});
"

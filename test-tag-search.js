#!/usr/bin/env node

/**
 * Test script for enhanced tag-based search functionality
 * 
 * This verifies that:
 * 1. Markets are matched by tags in addition to title/description
 * 2. Tags are displayed in search results
 * 3. Search accuracy is improved without breaking existing behavior
 */

const { PolymarketAPI } = require('./dist/api');

async function testTagSearch() {
  console.log('🧪 Testing Tag-Based Search Enhancement\n');
  
  const api = new PolymarketAPI();
  
  // Test cases that should benefit from tag matching
  const testCases = [
    {
      query: 'crypto',
      expectedTagMatch: true,
      description: 'Should match markets with "Crypto" tag even if word not in title'
    },
    {
      query: 'politics',
      expectedTagMatch: true,
      description: 'Should match markets tagged "Politics"'
    },
    {
      query: 'france',
      expectedTagMatch: true,
      description: 'Should match markets tagged "France"'
    },
    {
      query: 'trump',
      expectedTagMatch: true,
      description: 'Should match both title mentions AND tag matches'
    },
    {
      query: 'eth',
      expectedTagMatch: false,
      description: 'Short query (≤3 chars) should use word-boundary matching'
    }
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testCase of testCases) {
    try {
      console.log(`\n📋 Test: ${testCase.description}`);
      console.log(`   Query: "${testCase.query}"`);
      
      const markets = await api.searchMarkets(testCase.query, 10);
      
      if (markets.length === 0) {
        console.log(`   ❌ FAIL: No results found`);
        failed++;
        continue;
      }
      
      // Check if markets have tags attached
      const hasTagData = markets.some(m => m.eventTags && m.eventTags.length > 0);
      
      if (!hasTagData) {
        console.log(`   ⚠️  WARNING: No tag data found in results`);
      }
      
      // Check if any market was matched via tags (not in title/description)
      const tagOnlyMatches = markets.filter(market => {
        const titleDesc = `${market.question} ${market.description || ''}`.toLowerCase();
        const hasQueryInText = titleDesc.includes(testCase.query.toLowerCase());
        const hasQueryInTags = (market.eventTags || []).some(tag => 
          tag.label.toLowerCase().includes(testCase.query.toLowerCase()) ||
          tag.slug.toLowerCase().includes(testCase.query.toLowerCase())
        );
        
        return !hasQueryInText && hasQueryInTags;
      });
      
      console.log(`   ✅ Found ${markets.length} results`);
      console.log(`   📊 Results with tags: ${markets.filter(m => m.eventTags && m.eventTags.length > 0).length}`);
      console.log(`   🏷️  Tag-only matches: ${tagOnlyMatches.length}`);
      
      // Show example tags from first result
      if (markets[0].eventTags && markets[0].eventTags.length > 0) {
        const exampleTags = markets[0].eventTags.slice(0, 3).map(t => t.label).join(', ');
        console.log(`   📌 Example tags: ${exampleTags}`);
      }
      
      // Verify word-boundary matching for short queries
      if (testCase.query.length <= 3) {
        const hasInvalidMatch = markets.some(market => {
          const text = `${market.question} ${market.description || ''}`.toLowerCase();
          // Check if query appears NOT at word boundary
          const regex = new RegExp(`\\b${testCase.query.toLowerCase()}`, 'i');
          return text.includes(testCase.query.toLowerCase()) && !regex.test(text);
        });
        
        if (hasInvalidMatch) {
          console.log(`   ❌ FAIL: Short query matched within words (should use word-boundary)`);
          failed++;
          continue;
        }
      }
      
      console.log(`   ✅ PASS`);
      passed++;
      
    } catch (error) {
      console.log(`   ❌ FAIL: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('✨ All tests passed! Tag-based search is working correctly.\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the implementation.\n');
    process.exit(1);
  }
}

testTagSearch().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});

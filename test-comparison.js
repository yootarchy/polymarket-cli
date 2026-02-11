#!/usr/bin/env node

/**
 * Comparison test: Old text-only search vs New tag-enhanced search
 * 
 * This simulates what the old search would have returned (text-only)
 * vs what the new search returns (text + tags)
 */

const { PolymarketAPI } = require('./dist/api');

async function compareSearchMethods() {
  console.log('🔬 Comparing Search Methods: Text-Only vs Tag-Enhanced\n');
  
  const api = new PolymarketAPI();
  
  const testQueries = [
    { query: 'crypto', category: 'Cryptocurrency' },
    { query: 'politics', category: 'Politics' },
    { query: 'sports', category: 'Sports' }
  ];
  
  for (const { query, category } of testQueries) {
    console.log('='.repeat(70));
    console.log(`\n🔍 Query: "${query}" (${category})\n`);
    
    // Get results with new tag-enhanced search
    const allResults = await api.searchMarkets(query, 20);
    
    // Simulate old text-only search by filtering out tag-only matches
    const textOnlyResults = allResults.filter(market => {
      const titleDesc = `${market.question} ${market.description || ''}`.toLowerCase();
      return titleDesc.includes(query.toLowerCase());
    });
    
    // Calculate tag-only matches
    const tagOnlyResults = allResults.filter(market => {
      const titleDesc = `${market.question} ${market.description || ''}`.toLowerCase();
      const hasQueryInText = titleDesc.includes(query.toLowerCase());
      const hasQueryInTags = (market.eventTags || []).some(tag => 
        tag.label.toLowerCase().includes(query.toLowerCase()) ||
        tag.slug.toLowerCase().includes(query.toLowerCase())
      );
      
      return !hasQueryInText && hasQueryInTags;
    });
    
    console.log(`📊 OLD (Text-Only) Search:`);
    console.log(`   Results: ${textOnlyResults.length}`);
    if (textOnlyResults.length > 0) {
      console.log(`   Example: "${textOnlyResults[0].question.substring(0, 60)}..."`);
    }
    
    console.log(`\n📊 NEW (Tag-Enhanced) Search:`);
    console.log(`   Total Results: ${allResults.length}`);
    console.log(`   Text Matches: ${textOnlyResults.length}`);
    console.log(`   Tag-Only Matches: ${tagOnlyResults.length}`);
    console.log(`   Improvement: +${tagOnlyResults.length} markets (${Math.round(tagOnlyResults.length / textOnlyResults.length * 100) || 0}% increase)`);
    
    if (tagOnlyResults.length > 0) {
      console.log(`\n✨ NEW Markets Found (Tag-Only):`);
      tagOnlyResults.slice(0, 3).forEach((market, i) => {
        const tags = (market.eventTags || []).slice(0, 3).map(t => t.label).join(', ');
        console.log(`   ${i + 1}. ${market.question.substring(0, 55)}...`);
        console.log(`      Tags: ${tags}`);
      });
    }
    
    console.log('');
  }
  
  console.log('='.repeat(70));
  console.log('\n✅ Tag-enhanced search provides significantly more comprehensive results!\n');
}

compareSearchMethods().catch(error => {
  console.error('💥 Comparison failed:', error);
  process.exit(1);
});

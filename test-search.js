const axios = require('axios');

async function testSearch() {
  const allMarkets = [];
  const pageSize = 500;
  const maxPages = 10;
  const activeOnly = true;
  
  for (let page = 0; page < maxPages; page++) {
    const params = {
      limit: pageSize,
      offset: page * pageSize,
    };
    
    if (activeOnly) {
      params.closed = false;
    }
    
    console.log(`Fetching page ${page}, params:`, params);
    
    const client = axios.create({ timeout: 10000 });
    const response = await client.get('https://gamma-api.polymarket.com/events', { params });
    
    console.log(`Got ${response.data.length} events`);
    
    if (response.data.length === 0) break;
    
    for (const event of response.data) {
      if (event.markets && Array.isArray(event.markets)) {
        allMarkets.push(...event.markets);
      }
    }
    
    console.log(`Total markets so far: ${allMarkets.length}`);
    
    if (page === 0) break; // Just test first page
  }
  
  console.log(`Total markets: ${allMarkets.length}`);
  
  const query = 'bitcoin';
  const filtered = allMarkets.filter(market => {
    const question = market.question || '';
    const description = market.description || '';
    const combined = `${question} ${description}`;
    return combined.toLowerCase().includes(query);
  });
  
  console.log(`Filtered: ${filtered.length} markets`);
  filtered.slice(0, 5).forEach(m => console.log('-', m.question));
}

testSearch().catch(console.error);

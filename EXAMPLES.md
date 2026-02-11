# 📚 Usage Examples

Real-world examples of how to use Polymarket CLI effectively.

## Interactive Mode Examples

### Example 1: Daily Market Check

```bash
$ poly
# Search "crypto" → Filter by "Trending" → Browse results
# Then search "politics" → Filter by "Ending Soon"
# Exit when done
```

**Use Case**: Morning routine to check active markets in your areas of interest.

### Example 2: Deep Dive on Topic

```bash
$ poly
# Search "artificial intelligence"
# Filter by "All Markets" to see everything
# Find interesting market → "Watch a market" → Enter number
# Monitor for a while, then Ctrl+C to return
# "New search" to explore related topics
```

**Use Case**: Research mode when you want to thoroughly explore a subject.

### Example 3: Quick Trending Check

```bash
$ poly
# Just hit Enter on empty search to skip
# Or search "*" or "trump" for broad results
# Filter by "Trending" to see what's hot
# "Exit" when done
```

**Use Case**: Quick pulse check on what's moving in prediction markets.

## One-Shot Command Examples

### Example 4: Scripting Alerts

```bash
#!/bin/bash
# Check if Bitcoin markets are heating up

VOLUME=$(poly search bitcoin | grep Volume | head -1 | cut -d: -f2)
echo "Bitcoin markets volume: $VOLUME"

# Could add logic to send notifications if volume exceeds threshold
```

**Use Case**: Automated monitoring scripts.

### Example 5: Daily Cron Job

```bash
# Add to crontab
0 9 * * * poly trending | head -20 | mail -s "Daily Polymarket Trends" you@email.com
```

**Use Case**: Morning email digest of trending markets.

### Example 6: Quick Terminal Lookup

```bash
# Quick check without entering interactive mode
poly search "trump 2026" | grep YES
poly trending | head -10
poly ending
```

**Use Case**: Fast lookups while working on other tasks.

## Advanced Workflows

### Workflow 1: Trader's Morning Routine

```bash
# 1. Check trending first
poly trending

# 2. Interactive deep dive
poly
# → Search "crypto"
# → Filter: Trending
# → Search "politics"
# → Filter: Ending Soon
# → Watch any interesting markets
# → Exit

# 3. Set up watch on key market
poly watch <condition-id-from-earlier>
```

### Workflow 2: Research Mode

```bash
# Start interactive, stay in it
poly

# Chain of searches:
# 1. Broad: "2026"
# 2. Narrow: "2026 election"
# 3. Specific: "trump election 2026"
# 4. Related: "republican 2026"

# Use filters at each step to refine
# Watch interesting markets as you go
```

### Workflow 3: Monitor Portfolio

```bash
# Save market IDs you care about
echo "condition-id-1
condition-id-2
condition-id-3" > my-markets.txt

# Watch them in sequence
while read market; do
  echo "Checking $market"
  poly watch $market &
  sleep 60
done < my-markets.txt
```

## Search Tips

### Effective Search Queries

**Good searches:**
```
poly search "bitcoin"
poly search "2026 election"
poly search "AI breakthrough"
poly search "sports championship"
```

**Broad discoveries:**
```
poly search "trump"
poly search "crypto"
poly search "AI"
```

**Specific events:**
```
poly search "super bowl"
poly search "GPT-5"
poly search "federal reserve"
```

### Filter Strategy

**Start broad, then narrow:**
1. Search "AI" → Filter: All Markets (see everything)
2. Filter: Trending (what's hot)
3. Filter: Ending Soon (what's urgent)

**Time-based strategy:**
- **Morning**: Trending (see overnight action)
- **Midday**: Ending Soon (closing soon decisions)
- **Evening**: Long-Term (research future bets)

## Integration Examples

### Example 7: Alfred Workflow (macOS)

```bash
# Alfred script to quickly search markets
poly search "{query}"
```

### Example 8: Tmux Integration

```bash
# Create split pane with live watch
tmux split-window -h "poly watch <condition-id>"
```

### Example 9: Raycast Script

```bash
#!/bin/bash
# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Search Polymarket
# @raycast.mode fullOutput
# @raycast.packageName Polymarket
# @raycast.argument1 { "type": "text", "placeholder": "Search query" }

poly search "$1"
```

## Tips & Tricks

### Quick Access Alias

Add to your `.bashrc` or `.zshrc`:

```bash
alias pm="poly"
alias pms="poly search"
alias pmt="poly trending"
alias pme="poly ending"
```

Usage:
```bash
pm              # Interactive mode
pms "bitcoin"   # Quick search
pmt             # Trending
pme             # Ending soon
```

### Pipe to Less for Long Results

```bash
poly trending | less
poly search "election" | less
```

### Save Results

```bash
poly trending > today-trending.txt
poly search "AI" > ai-markets.txt
```

### Combine with Other Tools

```bash
# Count Bitcoin markets
poly search "bitcoin" | grep -c "YES:"

# Get just URLs
poly trending | grep "polymarket.com"

# Extract volumes
poly trending | grep "Volume:" | cut -d: -f2
```

## Common Use Cases

### For Traders
```bash
# Morning: Check trends
poly trending

# Throughout day: Quick searches
poly search "crypto"
poly search "stocks"

# Evening: Research tomorrow's markets
poly ending
```

### For Researchers
```bash
# Start interactive and stay there
poly

# Deep research on topic with multiple searches
# Use all filter types to get different views
# Watch key markets to see live movement
```

### For Developers
```bash
# Integrate into scripts
OUTPUT=$(poly search "bitcoin")
VOLUME=$(echo "$OUTPUT" | grep Volume | head -1 | cut -d$ -f2 | cut -dM -f1)

if [ "$VOLUME" -gt 1 ]; then
  echo "High activity detected!"
fi
```

---

**Found a cool use case? Share it!**

# ✅ Test Checklist

Run through this before your interview or demo.

## 🏗️ Build Check

```bash
cd /Users/tai/.openclaw/workspace/polymarket-cli
npm run build
```

**Expected:** No errors, `dist/` folder created

---

## 🧪 Command Tests

### 1. Help Command
```bash
node dist/index.js --help
```
**Expected:**
- Shows all 4 commands
- Clean formatting
- Version info

### 2. Search Command
```bash
node dist/index.js search "bitcoin"
```
**Expected:**
- Loading spinner appears
- Returns 5 markets max
- Colored output (green/red)
- Shows odds, volume, end date
- Clickable URLs

### 3. Trending Command
```bash
node dist/index.js trending
```
**Expected:**
- Loading spinner
- Returns 10 markets
- Sorted by 24hr volume
- All formatting correct

### 4. Ending Command
```bash
node dist/index.js ending
```
**Expected:**
- Works (may return 0 markets)
- No errors
- Correct filtering (<7 days)

### 5. Watch Command
```bash
# Get a condition ID from trending first
node dist/index.js trending

# Copy a condition ID and test
node dist/index.js watch 0x46d40e851b24d9b0af4bc1942ccd86439cae82a9011767da14950df0ad997adf
```

**Expected:**
- Clears screen
- Shows market info
- Updates every 30s
- Ctrl+C exits cleanly
- Shows "Stopped watching" message

---

## 🚨 Error Handling Tests

### Invalid Market ID
```bash
node dist/index.js watch invalid-id
```
**Expected:** Helpful error message

### Empty Search
```bash
node dist/index.js search ""
```
**Expected:** Still works (returns results)

### Unknown Command
```bash
node dist/index.js badcommand
```
**Expected:** "Invalid command" with help hint

---

## 🎨 Visual Check

Run each command and verify:

- [ ] Colors display correctly
  - Green for YES favorite
  - Red for NO favorite
  - Cyan for volume
  - Yellow for dates

- [ ] Spinners work smoothly
  - Shows while loading
  - Disappears when done

- [ ] Formatting is clean
  - No weird line breaks
  - Proper spacing
  - Readable layout

- [ ] Arrows display (↑↓)
  - Shows on higher probability

---

## 📦 Distribution Test (Optional)

### Test with npx
```bash
npx . search "AI"
npx . trending
```

### Test global install
```bash
npm link
poly search "bitcoin"
poly --help
npm unlink
```

---

## ⏱️ Performance Check

All commands should:
- Start within 1 second
- Complete within 5 seconds (except watch)
- Show loading feedback immediately

---

## 📝 Documentation Check

Verify these files exist and are complete:

- [ ] README.md - User docs
- [ ] QUICKSTART.md - Quick start guide
- [ ] DEMO.md - Demo script
- [ ] PROJECT_SUMMARY.md - Overview
- [ ] OVERVIEW.md - Complete breakdown
- [ ] CONTRIBUTING.md - Contributor guide
- [ ] LICENSE - MIT License

---

## 🎯 Demo Rehearsal

Run through your demo script:

1. [ ] Show help → `poly --help`
2. [ ] Search example → `poly search "AI"`
3. [ ] Show trending → `poly trending`
4. [ ] Watch a market → `poly watch <id>`
5. [ ] Exit cleanly → Ctrl+C

**Time:** Should take 3-5 minutes

**Practice until smooth!**

---

## ✨ Final Checks

- [ ] All TypeScript compiles without errors
- [ ] No console warnings
- [ ] All commands return results
- [ ] Error messages are helpful
- [ ] Colors work in your terminal
- [ ] Watch mode updates correctly
- [ ] Ctrl+C exits gracefully
- [ ] Help text is accurate
- [ ] URLs are clickable
- [ ] Performance is snappy

---

## 🎉 Ready to Demo?

If all checks pass:
- ✅ You're ready for interview
- ✅ You're ready to publish
- ✅ You're ready to share

**Go crush it! 🚀**

---

## 🐛 Common Issues

**Problem:** Colors don't show  
**Fix:** Make sure terminal supports colors (most do)

**Problem:** API errors  
**Fix:** Check internet connection, API might be down

**Problem:** Watch mode doesn't update  
**Fix:** Verify market ID is correct, try different market

**Problem:** npm install fails  
**Fix:** Delete node_modules and package-lock.json, reinstall

---

## 📞 Pre-Demo Checklist

30 minutes before demo:

- [ ] Run `npm run build` to ensure fresh build
- [ ] Test all 4 commands once
- [ ] Check internet connection
- [ ] Have fallback examples ready
- [ ] Know your talking points (see DEMO.md)
- [ ] Have OVERVIEW.md open for reference

**You got this! 💪**

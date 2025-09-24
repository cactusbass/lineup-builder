# QA Testing Guide: Season-Long Balance Tracking

## 🎯 Testing Objectives
Verify that the lineup generator now considers cumulative stats from previous games to ensure fair distribution across the entire season.

## 🧪 Test Scenarios

### **Test 1: Fresh Start (Baseline)**
**Setup:**
- Clear browser data or use incognito mode
- Enter team code (e.g., "test")
- Add 10 players to roster

**Steps:**
1. Generate Game 1 lineup
2. Note which players get which positions
3. Check season stats (should all be zero initially)

**Expected Result:**
- Lineup generates normally
- Season stats show zero for all players
- All players get fair distribution within Game 1

---

### **Test 2: Second Game (Cumulative Balance)**
**Setup:**
- Same 10 players from Test 1
- Game 1 already generated

**Steps:**
1. Generate Game 2 lineup
2. Compare with Game 1 positions
3. Check season stats

**Expected Result:**
- Players who got less playing time in Game 1 should get priority in Game 2
- Season stats should show cumulative totals from both games
- Overall balance should improve across the two games

---

### **Test 3: Position Balance Over Time**
**Setup:**
- Same 10 players
- Generate 3-4 games

**Steps:**
1. Generate Game 3 lineup
2. Generate Game 4 lineup
3. Review cumulative position distribution

**Expected Result:**
- Infield/outfield/pitching time should balance across all games
- No player consistently gets the same position
- Cumulative stats show fair distribution

---

### **Test 4: Bench Time Balance**
**Setup:**
- Add 12+ players to roster (creates bench time)
- Generate multiple games

**Steps:**
1. Generate several games
2. Track which players get benched
3. Check if benched players get priority in future games

**Expected Result:**
- Players who were benched more should get priority for playing time
- Bench time should balance across the season
- No player consistently sits out

---

### **Test 5: Missed Games (Should Not Count)**
**Setup:**
- 10 players in roster
- Generate Game 1 with all players
- Generate Game 2 with only 8 players (2 miss the game)

**Steps:**
1. Generate Game 1 lineup (all 10 players)
2. Generate Game 2 lineup (only 8 players available)
3. Check season stats

**Expected Result:**
- Missed players should NOT have their stats penalized
- Only players who actually played should have their stats updated
- Game 3 should treat all players fairly based on actual participation

---

## 🔍 How to Check Season Stats

### **Method 1: Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Type: `console.log(seasonStats)`
4. Review the cumulative stats for each player

### **Method 2: Local Storage**
1. Open developer tools (F12)
2. Go to Application/Storage tab
3. Look for `lineupBuilder_[teamcode]_seasonStats`
4. View the JSON data

### **Method 3: Lineup Analysis**
1. Generate multiple games
2. Review the lineup statistics table
3. Check if cumulative balance improves over time

---

## ✅ Success Criteria

### **Game 1:**
- [ ] Lineup generates successfully
- [ ] Season stats are empty/zero
- [ ] Fair distribution within the game

### **Game 2:**
- [ ] Players with less Game 1 time get priority
- [ ] Season stats show cumulative totals
- [ ] Overall balance improves

### **Multiple Games:**
- [ ] Position time balances across games
- [ ] Bench time balances across games
- [ ] No player consistently disadvantaged
- [ ] Cumulative stats show fair distribution

### **Missed Games:**
- [ ] Missed players not penalized in stats
- [ ] Only participating players have stats updated
- [ ] Future games treat all players fairly

---

## 🐛 Common Issues to Watch For

### **Issue 1: Season Stats Not Updating**
- **Symptom:** Stats remain zero after generating lineups
- **Check:** Console for errors, localStorage for data

### **Issue 2: No Cumulative Balance**
- **Symptom:** Same players get same positions every game
- **Check:** Priority calculation, season stats loading

### **Issue 3: Missed Games Counted**
- **Symptom:** Players who miss games have negative stats
- **Check:** Available players logic, stats update logic

### **Issue 4: Browser Data Issues**
- **Symptom:** Stats don't persist between sessions
- **Check:** localStorage, team code, data saving

---

## 📊 Sample Test Data

### **10-Player Roster:**
```
1. Alex (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
2. Blake (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
3. Casey (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
4. Drew (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
5. Evan (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
6. Finn (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
7. Grace (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
8. Henry (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
9. Ivy (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
10. Jack (P, C, 1B, 2B, SS, 3B, LF, CF, RF)
```

### **12-Player Roster (for bench testing):**
```
Add 2 more players with same position availability
```

---

## 🚀 Quick Test Commands

### **Clear All Data:**
```javascript
// In browser console
localStorage.clear();
location.reload();
```

### **Check Season Stats:**
```javascript
// In browser console
console.log(seasonStats);
```

### **Check Team Code:**
```javascript
// In browser console
console.log(currentTeamCode);
```

---

## 📝 Test Results Template

### **Test Date:** ___________
### **Team Code:** ___________
### **Number of Players:** ___________

#### **Game 1 Results:**
- [ ] Generated successfully
- [ ] Season stats: ___________
- [ ] Notes: ___________

#### **Game 2 Results:**
- [ ] Generated successfully
- [ ] Cumulative balance: ___________
- [ ] Season stats: ___________
- [ ] Notes: ___________

#### **Game 3 Results:**
- [ ] Generated successfully
- [ ] Position balance: ___________
- [ ] Season stats: ___________
- [ ] Notes: ___________

#### **Overall Assessment:**
- [ ] Season-long balance working
- [ ] Position distribution fair
- [ ] Bench time balanced
- [ ] Missed games handled correctly

#### **Issues Found:**
- ___________
- ___________
- ___________

#### **Recommendations:**
- ___________
- ___________
- ___________

# Test Examples for Skate 3 Support Bot

## Test Cases Based on Real Ticket Data

### 1. RPCS3 Setup Issues
**Test Input:** "how do i set the rpcs up"
**Expected:** Bot should detect RPCS3 keywords and provide beginners guide link

**Test Input:** "when i try to download rpcs3 it says this"
**Expected:** Bot should provide RPCS3 setup solution with high confidence

### 2. Graphics/Savefile Issues
**Test Input:** "whenever i replace my savefile i get all of the contents of the file except the graphic itself"
**Expected:** Bot should detect graphics issue and suggest RPCN connection + _install folder deletion

**Test Input:** "the graphic is supposed to be on my board but its just a blank deck"
**Expected:** High confidence response about RPCN and missing graphics

### 3. Black Screen Issues
**Test Input:** "whenever i launch my game it just black screens"
**Expected:** Bot should provide black screen troubleshooting steps

**Test Input:** "game won't load after installing mods"
**Expected:** Should suggest restoring original files and proper mod installation

### 4. Mod Installation
**Test Input:** "how do i use the cfss"
**Expected:** Should point to FAQ

**Test Input:** "game crashes after installing mods"
**Expected:** Should provide mod troubleshooting steps

### 5. Performance Issues
**Test Input:** "high FPS mod from Native menu causes render issues"
**Expected:** Should explain render distance issue and suggest SmokeyFE's menu

### 6. Game Updates
**Test Input:** "how do i update my game"
**Expected:** Should ask about BLUS/BLES and provide PKG installation steps

### 7. General Help
**Test Input:** "help"
**Expected:** Should provide general resource links

**Test Input:** "@bot I need help with skate 3"
**Expected:** Should trigger support system when bot is mentioned

### 8. Admin Commands
**Test Input:** "!admin close" (from admin)
**Expected:** Should confirm ticket closure

**Test Input:** "!admin close" (from regular user)
**Expected:** Should deny permission

## Testing the Knowledge Base

Run these tests to ensure the bot responds appropriately:

```javascript
// Test the knowledge base directly
const { findBestSolution, getRelevantSolutions } = require('./knowledge-base.js');

// Test 1: RPCS3 issue
console.log(findBestSolution("how do i set the rpcs up"));

// Test 2: Graphics issue
console.log(findBestSolution("my board graphics are missing after savefile"));

// Test 3: Multiple solutions
console.log(getRelevantSolutions("rpcs3 black screen crash", 3));
```

## Expected Bot Behavior

1. **Automatic Detection**: Bot should respond when keywords are mentioned
2. **Confidence Scoring**: Higher confidence for exact matches
3. **Helpful Reactions**: ✅ and ❌ reactions for user feedback
4. **Fallback**: General help when no specific solution found
5. **Resource Links**: Always include links to guides and channels
6. **Admin Protection**: Admin commands require proper permissions

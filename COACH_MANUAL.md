# Lineup Builder - Coach Manual

## Quick Start Guide

### Getting Started
1. **Open the application** in your web browser at [https://cactusbass.github.io/lineup-builder/](https://cactusbass.github.io/lineup-builder/)
2. **Enter your Team Code** - you'll be prompted to enter your unique team code to access your team's data
3. **Start with the Dashboard** - your home base for managing your team
4. **Add your players** using the Players section
5. **Schedule a game** and generate lineups automatically

---

## Key Features

### Team Code System
- **Required authentication** - you must enter your team code to access the application
- **Unique team access** - each coach gets a personalized team code for their team
- **Secure data isolation** - your team data is completely separate from other teams
- **Data persistence** - your players, games, and lineups are saved per team code
- **Easy switching** - you can enter different team codes to manage multiple teams
- **Logout button** - located in the top-right corner to easily logout and switch teams

### Dashboard
- **Overview** of your team stats (total players, pitchers, catchers)
- **Quick access** to recent games and lineup generation
- **Team management** shortcuts

### Players Management
- **Add players** with names and special roles (pitcher/catcher)
- **Set position restrictions** - exclude players from specific positions
- **Edit or remove** players as needed
- **Visual badges** show pitcher/catcher status and excluded positions

### Games & Lineups
- **Schedule games** with opponent, date, and number of innings
- **Select available players** for each game
- **Generate defensive lineups** with advanced rotation algorithms
- **Create batting orders** with drag-and-drop functionality
- **View comprehensive lineup statistics** and playing time balance
- **Print lineup cards** for easy reference during games

### Smart Lineup Generation
The system automatically:
- **Rotates pitchers** (max 2 innings per pitcher, prefers 6 different pitchers)
- **Manages catchers** (max 2 innings, no consecutive innings)
- **Balances playing time** (equal infield/outfield time distribution)
- **Respects position exclusions** and player availability
- **Manages bench time** fairly when you have 10+ players
- **Uses advanced algorithms** with multi-factor scoring for fair selection

### Rules & Constraints Tab
- **Transparent algorithm** - View all the rules and logic used to generate lineups
- **Core principles** - Understand how positions are filled and players are selected
- **Pitching rules** - See how pitcher rotation and limits are managed
- **Catching rules** - Learn about catcher rotation and rest requirements
- **Playing time balance** - Understand how fair playing time is calculated
- **Bench management** - See how bench time is distributed fairly
- **Algorithm transparency** - Full visibility into the decision-making process

---

## Step-by-Step Workflow

### 1. Access Your Team
1. **Open the application** at [https://cactusbass.github.io/lineup-builder/](https://cactusbass.github.io/lineup-builder/)
2. **Enter your Team Code** when prompted
3. **Access your team's dashboard** and data

### 2. Set Up Your Team
1. Go to **Players** page
2. Click **"Add Player"**
3. Enter player name
4. Check **"Pitcher"** if they can pitch
5. Check **"Catcher"** if they can catch
6. Select any **excluded positions** (positions they cannot play)
7. Click **"Add Player"**

### 3. Schedule a Game
1. Go to **Games** page
2. Click **"Schedule Game"**
3. Enter opponent name and date
4. Select number of innings (5, 6, or 7)
5. Choose which players are available
6. Click **"Schedule Game"**

### 4. Generate Lineup
1. From the Games page, click on your game to open **Game Details**
2. Click **"Generate Defensive Lineup"** to create position rotations
3. Use **"Auto-Generate Order"** or drag-and-drop to create batting order
4. Review the **comprehensive statistics** and playing time balance
5. **Print lineup cards** for easy reference during the game

### 5. Verify Lineup Balance
1. **Check the statistics table** - Shows innings played by each player at each position
2. **Review playing time distribution** - Ensure fair infield/outfield time balance
3. **Verify pitcher rotation** - Confirm no one pitches more than 2 innings
4. **Check catcher rotation** - Ensure no consecutive catching innings
5. **Examine bench time** - Verify fair distribution when you have 10+ players

---

## Tips for Best Results

### Player Setup
- **Mark all pitchers** - this ensures proper rotation
- **Mark all catchers** - prevents players from being forced to catch
- **Use excluded positions** for players with physical limitations
- **Add all team members** for fair playing time distribution

### Game Management
- **Check player availability** before each game
- **Adjust innings** based on league rules (5-7 innings)
- **Review generated lineups** before printing or sharing

### Lineup Review
- **Check statistics table** to ensure fair playing time
- **Verify pitcher rotation** - no one should pitch too many innings
- **Confirm position restrictions** are respected
- **Review Rules & Constraints tab** to understand the algorithm logic
- **Use the statistics analyzer** to verify balance and fairness

---

## Sample Team Setup

The app starts with an empty roster, so you'll need to add your players. The system is designed to work with:
- **9 players minimum** (perfect setup - everyone plays all innings)
- **10+ players** (includes bench rotation for fair playing time)
- **Designated pitchers and catchers** (marked with P and C badges)
- **Position exclusions** for players with limitations

---

## Getting Help

### Common Issues
- **Can't access the app?** Make sure you have the correct team code
- **Want to logout or switch teams?** Use the "Logout" button in the top-right corner
- **No lineup generated?** Make sure you have enough players (minimum 9)
- **Player not appearing?** Check if they're marked as available for the game
- **Position conflicts?** Review excluded positions in player settings
- **Lost your team code?** Contact the application administrator for assistance

### Feedback
This is a beta version! Please share your feedback on:
- **Ease of use** - Is the interface intuitive?
- **Feature requests** - What would make this more useful?
- **Bug reports** - Any issues you encounter
- **Suggestions** - Ideas for improvement

---

## Technical Notes

- **Browser compatibility**: Works best in Chrome, Firefox, or Safari
- **Data storage**: Currently stores data in browser (refreshing page resets data)
- **Mobile friendly**: Responsive design works on tablets and phones

---

*Happy coaching!*

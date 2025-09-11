# ⚾ Lineup Builder

A web application for youth baseball coaches to create fair and balanced defensive lineups and batting orders.

## Features

- **Team Management**: Support for multiple teams with team codes
- **Player Management**: Add/edit players with position availability
- **Game Management**: Schedule games and track availability
- **Smart Lineup Generation**: Algorithm creates balanced defensive lineups
- **Batting Order**: Drag-and-drop batting order creation
- **Printable Lineups**: Generate printable lineup cards
- **Fair Playing Time**: Ensures equitable playing time for all players

## How to Use

1. **First Time**: Enter your team code (e.g., "kimner", "thunderbolts")
2. **Add Players**: Go to Players tab and add your roster
3. **Set Positions**: Mark which positions each player can play
4. **Schedule Games**: Add games and mark player availability
5. **Generate Lineups**: Create defensive lineups and batting orders
6. **Print**: Generate printable lineup cards

## Team Codes

- Each team gets a unique code
- Data is stored separately for each team
- Use "Switch Team" button to change teams
- Share your team code with other coaches

## Algorithm Rules

The lineup generation follows these principles:
- All positions must be filled each inning
- Maximum 2 innings per pitcher
- Maximum 2 innings per catcher (non-consecutive)
- Balanced infield/outfield time
- Fair bench time distribution
- Respects player position preferences

## Technical Details

- **Pure HTML/CSS/JavaScript** - No server required
- **Local Storage** - Data saved in browser
- **Team-Specific Data** - Each team's data is isolated
- **Responsive Design** - Works on desktop and mobile

## Deployment

This app is deployed on GitHub Pages and can be accessed at:
https://[username].github.io/lineup-builder

## Support

For questions or issues, please contact the development team.

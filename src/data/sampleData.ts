import type { Player, Team, Coach, Game, PlayerCombination } from '../types';

export const sampleCoach: Coach = {
  id: 'coach-1',
  name: 'Coach Johnson',
  email: 'coach.johnson@example.com',
  teams: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const samplePlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Alex Rodriguez',
    teamId: 'team-1',
    isPitcher: true,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-2',
    name: 'Mason Williams',
    teamId: 'team-1',
    isPitcher: true,
    isCatcher: true,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-3',
    name: 'Quincy Johnson',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: ['P'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-4',
    name: 'Ethan Davis',
    teamId: 'team-1',
    isPitcher: true,
    isCatcher: false,
    excludedPositions: ['1B'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-5',
    name: 'Liam Brown',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: true,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-6',
    name: 'Noah Wilson',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-7',
    name: 'Owen Miller',
    teamId: 'team-1',
    isPitcher: true,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-8',
    name: 'Caleb Taylor',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-9',
    name: 'Ryan Anderson',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-10',
    name: 'Jake Thomas',
    teamId: 'team-1',
    isPitcher: true,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-11',
    name: 'Tyler Jackson',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'player-12',
    name: 'Brandon White',
    teamId: 'team-1',
    isPitcher: false,
    isCatcher: false,
    excludedPositions: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const sampleTeam: Team = {
  id: 'team-1',
  name: 'Thunder Bolts',
  coachId: 'coach-1',
  players: samplePlayers,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const sampleGame: Game = {
  id: 'game-1',
  teamId: 'team-1',
  opponent: 'Lightning Strikes',
  date: new Date('2024-03-15'),
  innings: 6,
  availablePlayers: samplePlayers.map(p => p.id), // All players available
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const samplePlayerCombinations: PlayerCombination[] = [
  {
    id: 'combo-1',
    teamId: 'team-1',
    playerIds: ['player-3', 'player-4'], // Quincy at SS, Ethan at 1B
    description: 'Quincy at SS and Ethan at 1B',
    createdAt: new Date(),
  },
  {
    id: 'combo-2',
    teamId: 'team-1',
    playerIds: ['player-1', 'player-2'], // Alex and Mason together
    description: 'Alex and Mason battery',
    createdAt: new Date(),
  },
];

// Update the coach with the team
sampleCoach.teams = [sampleTeam];

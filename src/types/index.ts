export interface Player {
  id: string;
  name: string;
  teamId: string;
  isPitcher: boolean;
  isCatcher: boolean;
  excludedPositions: Position[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  coachId: string;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  teams: Team[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  teamId: string;
  opponent: string;
  date: Date;
  innings: number;
  availablePlayers: string[]; // Player IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Lineup {
  id: string;
  gameId: string;
  innings: InningLineup[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InningLineup {
  inning: number;
  positions: PositionAssignment[];
}

export interface PositionAssignment {
  position: Position;
  playerId: string;
  playerName: string;
}

export interface PlayerCombination {
  id: string;
  teamId: string;
  playerIds: string[];
  description: string;
  createdAt: Date;
}

export type Position = 
  | 'C'   // Catcher
  | 'P'   // Pitcher
  | '1B'  // First Base
  | '2B'  // Second Base
  | 'SS'  // Shortstop
  | '3B'  // Third Base
  | 'LF'  // Left Field
  | 'CF'  // Center Field
  | 'RF'; // Right Field

export const POSITIONS: Position[] = ['C', 'P', '1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF'];

export const INFIELD_POSITIONS: Position[] = ['1B', '2B', 'SS', '3B'];
export const OUTFIELD_POSITIONS: Position[] = ['LF', 'CF', 'RF'];

export interface LineupConstraints {
  maxPitchingInnings: number;
  requireEqualInfieldOutfield: boolean;
  respectPlayerExclusions: boolean;
  usePlayerCombinations: boolean;
}

export interface LineupStats {
  totalInnings: number;
  playerStats: PlayerLineupStats[];
}

export interface PlayerLineupStats {
  playerId: string;
  playerName: string;
  infieldInnings: number;
  outfieldInnings: number;
  pitchingInnings: number;
  totalInnings: number;
}

// In-Game Stats Types
export interface GameStats {
  gameId: string;
  innings: InningStats[];
  pitchers: PitcherStats[];
  batters: BatterStats[];
  currentInning: number;
  currentOuts: number;
  homeScore: number;
  awayScore: number;
  isHomeTeam: boolean;
  gameStatus: 'scheduled' | 'in-progress' | 'completed';
}

export interface InningStats {
  inning: number;
  homeRuns: number;
  awayRuns: number;
  homeHits: number;
  awayHits: number;
  homeErrors: number;
  awayErrors: number;
  isComplete: boolean;
}

export interface PitcherStats {
  playerId: string;
  playerName: string;
  inningsPitched: number;
  pitchesThrown: number;
  strikeouts: number;
  walks: number;
  hitsAllowed: number;
  runsAllowed: number;
  earnedRuns: number;
  isCurrentPitcher: boolean;
}

export interface BatterStats {
  playerId: string;
  playerName: string;
  atBats: number;
  hits: number;
  singles: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number;
  runs: number;
  walks: number;
  strikeouts: number;
  stolenBases: number;
}

export type HitType = 'single' | 'double' | 'triple' | 'home-run' | 'fielders-choice' | 'error';
export type OutType = 'strikeout' | 'groundout' | 'flyout' | 'popout' | 'lineout' | 'fielders-choice';
export type WalkType = 'walk' | 'hbp' | 'intentional-walk';

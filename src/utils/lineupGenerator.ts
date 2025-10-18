import type { 
  Player, 
  Game, 
  Lineup, 
  InningLineup, 
  PositionAssignment, 
  Position, 
  PlayerCombination,
  PlayerLineupStats
} from '../types';
import { INFIELD_POSITIONS, OUTFIELD_POSITIONS } from '../types';

export class LineupGenerator {
  private players: Player[];
  private game: Game;
  private playerCombinations: PlayerCombination[];

  constructor(players: Player[], game: Game, playerCombinations: PlayerCombination[] = []) {
    this.players = players;
    this.game = game;
    this.playerCombinations = playerCombinations;
  }

  generateLineup(): Lineup {
    const availablePlayers = this.players.filter(p => 
      this.game.availablePlayers.includes(p.id)
    );

    const innings: InningLineup[] = [];
    const pitcherUsage = new Map<string, number>();
    const playerStats = new Map<string, PlayerLineupStats>();
    const benchUsage = new Map<string, number>();

    // Initialize player stats
    availablePlayers.forEach(player => {
      playerStats.set(player.id, {
        playerId: player.id,
        playerName: player.name,
        infieldInnings: 0,
        outfieldInnings: 0,
        pitchingInnings: 0,
        totalInnings: 0,
      });
      benchUsage.set(player.id, 0);
    });

    // Create bench schedule if we have more than 9 players
    const benchSchedule = this.createBenchSchedule(availablePlayers);

    // Generate lineup for each inning
    for (let inning = 1; inning <= this.game.innings; inning++) {
      const benchedPlayers = benchSchedule[inning - 1] || new Set<string>();
      const inningLineup = this.generateInningLineup(
        availablePlayers, 
        inning, 
        pitcherUsage, 
        playerStats,
        benchedPlayers
      );
      innings.push(inningLineup);

      // Update stats
      inningLineup.positions.forEach(pos => {
        const stats = playerStats.get(pos.playerId);
        if (stats) {
          stats.totalInnings++;
          if (pos.position === 'P') {
            stats.pitchingInnings++;
          } else if (INFIELD_POSITIONS.includes(pos.position)) {
            stats.infieldInnings++;
          } else if (OUTFIELD_POSITIONS.includes(pos.position)) {
            stats.outfieldInnings++;
          }
        }
      });

      // Update bench usage
      benchedPlayers.forEach(playerId => {
        benchUsage.set(playerId, (benchUsage.get(playerId) || 0) + 1);
      });
    }

    return {
      id: `lineup-${Date.now()}`,
      gameId: this.game.id,
      innings,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  private generateInningLineup(
    availablePlayers: Player[],
    inning: number,
    pitcherUsage: Map<string, number>,
    playerStats: Map<string, PlayerLineupStats>,
    benchedPlayers: Set<string>
  ): InningLineup {
    const positions: PositionAssignment[] = [];
    const usedPlayers = new Set<string>();

    // 1. Select pitcher first (respecting rotation rules and avoiding benched players)
    const pitcher = this.selectPitcher(availablePlayers, pitcherUsage, usedPlayers, benchedPlayers);
    if (pitcher) {
      // Handle potential conflict if pitcher was scheduled to be benched
      this.handlePitcherBenchConflict(pitcher.id, benchedPlayers, availablePlayers, usedPlayers);
      
      positions.push({
        position: 'P',
        playerId: pitcher.id,
        playerName: pitcher.name,
      });
      usedPlayers.add(pitcher.id);
      pitcherUsage.set(pitcher.id, (pitcherUsage.get(pitcher.id) || 0) + 1);
    }

    // 2. Select catcher (avoiding benched players)
    const catcher = this.selectCatcher(availablePlayers, usedPlayers, benchedPlayers);
    if (catcher) {
      positions.push({
        position: 'C',
        playerId: catcher.id,
        playerName: catcher.name,
      });
      usedPlayers.add(catcher.id);
    }

    // 3. Fill remaining positions
    const remainingPositions: Position[] = ['1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF'];
    const remainingPlayers = availablePlayers.filter(p => 
      !usedPlayers.has(p.id) && !benchedPlayers.has(p.id)
    );

    // Try to apply player combinations first
    this.applyPlayerCombinations(positions, remainingPlayers, usedPlayers);

    // Fill remaining positions
    remainingPositions.forEach(position => {
      if (!positions.find(p => p.position === position)) {
        const player = this.selectPlayerForPosition(
          remainingPlayers, 
          position, 
          usedPlayers,
          playerStats
        );
        if (player) {
          positions.push({
            position,
            playerId: player.id,
            playerName: player.name,
          });
          usedPlayers.add(player.id);
        }
      }
    });

    return {
      inning,
      positions,
    };
  }

  private selectPitcher(
    availablePlayers: Player[],
    pitcherUsage: Map<string, number>,
    usedPlayers: Set<string>,
    benchedPlayers: Set<string>
  ): Player | null {
    const pitchers = availablePlayers.filter(p => 
      p.isPitcher && 
      !usedPlayers.has(p.id) && 
      !benchedPlayers.has(p.id) &&
      !p.excludedPositions.includes('P')
    );

    if (pitchers.length === 0) return null;

    // Find pitchers who haven't pitched yet
    const unUsedPitchers = pitchers.filter(p => !pitcherUsage.has(p.id));
    
    if (unUsedPitchers.length > 0) {
      // Select randomly from unused pitchers
      return unUsedPitchers[Math.floor(Math.random() * unUsedPitchers.length)];
    }

    // All pitchers have pitched, select one who has pitched least
    const minPitching = Math.min(...pitchers.map(p => pitcherUsage.get(p.id) || 0));
    const eligiblePitchers = pitchers.filter(p => (pitcherUsage.get(p.id) || 0) === minPitching);
    
    return eligiblePitchers[Math.floor(Math.random() * eligiblePitchers.length)];
  }

  private selectCatcher(
    availablePlayers: Player[],
    usedPlayers: Set<string>,
    benchedPlayers: Set<string>
  ): Player | null {
    const catchers = availablePlayers.filter(p => 
      p.isCatcher && 
      !usedPlayers.has(p.id) && 
      !benchedPlayers.has(p.id) &&
      !p.excludedPositions.includes('C')
    );

    if (catchers.length === 0) {
      // If no designated catchers, find any player who can catch
      const anyPlayer = availablePlayers.find(p => 
        !usedPlayers.has(p.id) && 
        !benchedPlayers.has(p.id) &&
        !p.excludedPositions.includes('C')
      );
      return anyPlayer || null;
    }

    return catchers[Math.floor(Math.random() * catchers.length)];
  }

  private selectPlayerForPosition(
    availablePlayers: Player[],
    position: Position,
    usedPlayers: Set<string>,
    playerStats: Map<string, PlayerLineupStats>
  ): Player | null {
    const eligiblePlayers = availablePlayers.filter(p => 
      !usedPlayers.has(p.id) && !p.excludedPositions.includes(position)
    );

    if (eligiblePlayers.length === 0) return null;

    // Try to balance infield/outfield time
    const isInfield = INFIELD_POSITIONS.includes(position);
    const isOutfield = OUTFIELD_POSITIONS.includes(position);

    if (isInfield || isOutfield) {
      // Prefer players who have less time in this type of position
      const sortedPlayers = eligiblePlayers.sort((a, b) => {
        const statsA = playerStats.get(a.id);
        const statsB = playerStats.get(b.id);
        
        if (!statsA || !statsB) return 0;
        
        const timeA = isInfield ? statsA.infieldInnings : statsA.outfieldInnings;
        const timeB = isInfield ? statsB.infieldInnings : statsB.outfieldInnings;
        
        return timeA - timeB;
      });

      return sortedPlayers[0];
    }

    // For other positions, select randomly
    return eligiblePlayers[Math.floor(Math.random() * eligiblePlayers.length)];
  }

  private applyPlayerCombinations(
    _positions: PositionAssignment[],
    availablePlayers: Player[],
    usedPlayers: Set<string>
  ): void {
    // This is a simplified version - in a real implementation,
    // you'd want more sophisticated logic to apply combinations
    // while respecting position constraints
    
    this.playerCombinations.forEach(combo => {
      if (combo.playerIds.length === 2) {
        const [player1Id, player2Id] = combo.playerIds;
        const player1 = availablePlayers.find(p => p.id === player1Id);
        const player2 = availablePlayers.find(p => p.id === player2Id);
        
        if (player1 && player2 && !usedPlayers.has(player1Id) && !usedPlayers.has(player2Id)) {
          // Apply the combination (this is a simplified example)
          // In reality, you'd need to specify which positions each player should take
          console.log(`Applying combination: ${combo.description}`);
        }
      }
    });
  }

  private createBenchSchedule(availablePlayers: Player[]): Set<string>[] {
    const numPlayers = availablePlayers.length;
    const innings = this.game.innings;
    
    // If 9 or fewer players, no bench needed
    if (numPlayers <= 9) {
      return Array(innings).fill(new Set<string>());
    }

    const playersToBenchPerInning = numPlayers - 9;
    const benchSchedule: Set<string>[] = [];
    
    // Track which players have been benched to ensure fair rotation
    const playersBenched = new Set<string>();
    const playersBenchedTwice = new Set<string>();
    
    for (let inning = 1; inning <= innings; inning++) {
      const benchIndices = new Set<string>();
      
      // First priority: Players who haven't been benched yet
      const playersNeverBenched = availablePlayers.filter(p => !playersBenched.has(p.id));
      
      // Second priority: Players who have been benched once (but not twice)
      const playersBenchedOnce = availablePlayers.filter(p => 
        playersBenched.has(p.id) && !playersBenchedTwice.has(p.id)
      );
      
      // Third priority: Players who have been benched twice (if necessary)
      const playersBenchedTwiceList = availablePlayers.filter(p => 
        playersBenchedTwice.has(p.id)
      );
      
      let remainingSlots = playersToBenchPerInning;
      
      // Fill with never benched players first
      const neverBenchedCount = Math.min(remainingSlots, playersNeverBenched.length);
      for (let i = 0; i < neverBenchedCount; i++) {
        const player = playersNeverBenched[i];
        benchIndices.add(player.id);
        playersBenched.add(player.id);
        remainingSlots--;
      }
      
      // Fill with once benched players
      const benchedOnceCount = Math.min(remainingSlots, playersBenchedOnce.length);
      for (let i = 0; i < benchedOnceCount; i++) {
        const player = playersBenchedOnce[i];
        benchIndices.add(player.id);
        playersBenchedTwice.add(player.id);
        remainingSlots--;
      }
      
      // Fill with twice benched players if necessary
      if (remainingSlots > 0) {
        const shuffledBenchedTwice = [...playersBenchedTwiceList].sort(() => Math.random() - 0.5);
        const benchedTwiceCount = Math.min(remainingSlots, shuffledBenchedTwice.length);
        for (let i = 0; i < benchedTwiceCount; i++) {
          benchIndices.add(shuffledBenchedTwice[i].id);
          remainingSlots--;
        }
      }
      
      benchSchedule.push(benchIndices);
    }
    
    return benchSchedule;
  }

  /**
   * Handles conflicts when a manually selected pitcher was scheduled to be benched.
   * This method adjusts the bench schedule to maintain fair rotation.
   */
  private handlePitcherBenchConflict(
    pitcherId: string,
    benchedPlayers: Set<string>,
    availablePlayers: Player[],
    usedPlayers: Set<string>
  ): void {
    if (benchedPlayers.has(pitcherId)) {
      // Remove the pitcher from the bench
      benchedPlayers.delete(pitcherId);
      
      // Find a replacement player for the bench
      const availableForBench = availablePlayers.filter(p => 
        !usedPlayers.has(p.id) && 
        !benchedPlayers.has(p.id) &&
        p.id !== pitcherId
      );
      
      if (availableForBench.length > 0) {
        // Select a replacement player (prefer non-pitchers to avoid further conflicts)
        const nonPitchers = availableForBench.filter(p => !p.isPitcher);
        const replacementPlayer = nonPitchers.length > 0 ? nonPitchers[0] : availableForBench[0];
        benchedPlayers.add(replacementPlayer.id);
      }
    }
  }
}

export function calculateLineupStats(lineup: Lineup, players: Player[]): PlayerLineupStats[] {
  const stats = new Map<string, PlayerLineupStats>();
  
  // Initialize stats for all players
  players.forEach(player => {
    stats.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      infieldInnings: 0,
      outfieldInnings: 0,
      pitchingInnings: 0,
      totalInnings: 0,
    });
  });

  // Calculate stats from lineup
  lineup.innings.forEach(inning => {
    inning.positions.forEach(pos => {
      const playerStats = stats.get(pos.playerId);
      if (playerStats) {
        playerStats.totalInnings++;
        
        if (pos.position === 'P') {
          playerStats.pitchingInnings++;
        } else if (INFIELD_POSITIONS.includes(pos.position)) {
          playerStats.infieldInnings++;
        } else if (OUTFIELD_POSITIONS.includes(pos.position)) {
          playerStats.outfieldInnings++;
        }
      }
    });
  });

  return Array.from(stats.values());
}

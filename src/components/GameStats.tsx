import React, { useState, useEffect } from 'react';
import { GameStats, HitType, OutType, WalkType, PitcherStats, BatterStats } from '../types';

interface GameStatsProps {
  gameId: string;
  teamName: string;
  opponentName: string;
  availablePlayers: Array<{ id: string; name: string }>;
  onStatsUpdate: (stats: GameStats) => void;
}

const GameStatsComponent: React.FC<GameStatsProps> = ({
  gameId,
  teamName,
  opponentName,
  availablePlayers,
  onStatsUpdate
}) => {
  const [gameStats, setGameStats] = useState<GameStats>({
    gameId,
    innings: [],
    pitchers: [],
    batters: [],
    currentInning: 1,
    currentOuts: 0,
    homeScore: 0,
    awayScore: 0,
    isHomeTeam: true,
    gameStatus: 'scheduled'
  });

  const [currentBatter, setCurrentBatter] = useState<string>('');
  const [currentPitcher, setCurrentPitcher] = useState<string>('');

  // Initialize game stats when component mounts
  useEffect(() => {
    const initializeStats = () => {
      const initialInnings = Array.from({ length: 9 }, (_, i) => ({
        inning: i + 1,
        homeRuns: 0,
        awayRuns: 0,
        homeHits: 0,
        awayHits: 0,
        homeErrors: 0,
        awayErrors: 0,
        isComplete: false
      }));

      const initialPitchers: PitcherStats[] = availablePlayers
        .filter(p => p.name.toLowerCase().includes('pitcher') || Math.random() > 0.7) // Mock pitcher detection
        .map(p => ({
          playerId: p.id,
          playerName: p.name,
          inningsPitched: 0,
          pitchesThrown: 0,
          strikeouts: 0,
          walks: 0,
          hitsAllowed: 0,
          runsAllowed: 0,
          earnedRuns: 0,
          isCurrentPitcher: false
        }));

      const initialBatters: BatterStats[] = availablePlayers.map(p => ({
        playerId: p.id,
        playerName: p.name,
        atBats: 0,
        hits: 0,
        singles: 0,
        doubles: 0,
        triples: 0,
        homeRuns: 0,
        rbi: 0,
        runs: 0,
        walks: 0,
        strikeouts: 0,
        stolenBases: 0
      }));

      if (initialPitchers.length > 0) {
        initialPitchers[0].isCurrentPitcher = true;
        setCurrentPitcher(initialPitchers[0].playerId);
      }

      if (initialBatters.length > 0) {
        setCurrentBatter(initialBatters[0].playerId);
      }

      const newStats: GameStats = {
        ...gameStats,
        innings: initialInnings,
        pitchers: initialPitchers,
        batters: initialBatters
      };

      setGameStats(newStats);
      onStatsUpdate(newStats);
    };

    initializeStats();
  }, [gameId]);

  const recordHit = (hitType: HitType) => {
    const newStats = { ...gameStats };
    const currentInningStats = newStats.innings[newStats.currentInning - 1];
    const currentBatterStats = newStats.batters.find(b => b.playerId === currentBatter);
    const currentPitcherStats = newStats.pitchers.find(p => p.isCurrentPitcher);

    if (currentBatterStats && currentPitcherStats) {
      // Update batter stats
      currentBatterStats.atBats++;
      currentBatterStats.hits++;
      
      switch (hitType) {
        case 'single':
          currentBatterStats.singles++;
          break;
        case 'double':
          currentBatterStats.doubles++;
          break;
        case 'triple':
          currentBatterStats.triples++;
          break;
        case 'home-run':
          currentBatterStats.homeRuns++;
          currentBatterStats.runs++;
          // Add run to current inning
          if (newStats.isHomeTeam) {
            currentInningStats.homeRuns++;
            newStats.homeScore++;
          } else {
            currentInningStats.awayRuns++;
            newStats.awayScore++;
          }
          break;
      }

      // Update pitcher stats
      currentPitcherStats.hitsAllowed++;
      currentPitcherStats.pitchesThrown += Math.floor(Math.random() * 3) + 1; // Mock pitch count

      // Update inning stats
      if (newStats.isHomeTeam) {
        currentInningStats.homeHits++;
      } else {
        currentInningStats.awayHits++;
      }
    }

    setGameStats(newStats);
    onStatsUpdate(newStats);
  };

  const recordOut = (outType: OutType) => {
    const newStats = { ...gameStats };
    const currentBatterStats = newStats.batters.find(b => b.playerId === currentBatter);
    const currentPitcherStats = newStats.pitchers.find(p => p.isCurrentPitcher);

    if (currentBatterStats && currentPitcherStats) {
      currentBatterStats.atBats++;
      newStats.currentOuts++;

      if (outType === 'strikeout') {
        currentBatterStats.strikeouts++;
        currentPitcherStats.strikeouts++;
      }

      currentPitcherStats.pitchesThrown += Math.floor(Math.random() * 4) + 2; // Mock pitch count

      // Check if inning is complete (3 outs)
      if (newStats.currentOuts >= 3) {
        newStats.currentOuts = 0;
        newStats.currentInning++;
        if (newStats.currentInning > 9) {
          newStats.gameStatus = 'completed';
        }
      }
    }

    setGameStats(newStats);
    onStatsUpdate(newStats);
  };

  const recordWalk = (walkType: WalkType) => {
    const newStats = { ...gameStats };
    const currentBatterStats = newStats.batters.find(b => b.playerId === currentBatter);
    const currentPitcherStats = newStats.pitchers.find(p => p.isCurrentPitcher);

    if (currentBatterStats && currentPitcherStats) {
      currentBatterStats.walks++;
      currentPitcherStats.walks++;
      currentPitcherStats.pitchesThrown += Math.floor(Math.random() * 5) + 3; // Mock pitch count
    }

    setGameStats(newStats);
    onStatsUpdate(newStats);
  };

  const addPitch = () => {
    const newStats = { ...gameStats };
    const currentPitcherStats = newStats.pitchers.find(p => p.isCurrentPitcher);
    
    if (currentPitcherStats) {
      currentPitcherStats.pitchesThrown++;
    }

    setGameStats(newStats);
    onStatsUpdate(newStats);
  };

  const startGame = () => {
    const newStats = { ...gameStats, gameStatus: 'in-progress' };
    setGameStats(newStats);
    onStatsUpdate(newStats);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Scoreboard */}
      <div className="bg-gray-900 text-white rounded-lg p-4 mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            {teamName} vs {opponentName}
          </h2>
          <div className="flex justify-center items-center space-x-8 text-3xl font-bold">
            <div className="text-center">
              <div className="text-4xl">{gameStats.homeScore}</div>
              <div className="text-sm">{teamName}</div>
            </div>
            <div className="text-2xl">-</div>
            <div className="text-center">
              <div className="text-4xl">{gameStats.awayScore}</div>
              <div className="text-sm">{opponentName}</div>
            </div>
          </div>
          <div className="mt-2 text-sm">
            Inning: {gameStats.currentInning} | Outs: {gameStats.currentOuts} | 
            Status: <span className="capitalize">{gameStats.gameStatus}</span>
          </div>
        </div>
      </div>

      {/* Game Controls */}
      {gameStats.gameStatus === 'scheduled' && (
        <div className="text-center mb-6">
          <button
            onClick={startGame}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Start Game
          </button>
        </div>
      )}

      {gameStats.gameStatus === 'in-progress' && (
        <div className="space-y-6">
          {/* Current Players */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Current Batter</h3>
              <select
                value={currentBatter}
                onChange={(e) => setCurrentBatter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {availablePlayers.map(player => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Current Pitcher</h3>
              <select
                value={currentPitcher}
                onChange={(e) => setCurrentPitcher(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {gameStats.pitchers.map(pitcher => (
                  <option key={pitcher.playerId} value={pitcher.playerId}>
                    {pitcher.playerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Record Hit</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => recordHit('single')}
                  className="bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  Single
                </button>
                <button
                  onClick={() => recordHit('double')}
                  className="bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  Double
                </button>
                <button
                  onClick={() => recordHit('triple')}
                  className="bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  Triple
                </button>
                <button
                  onClick={() => recordHit('home-run')}
                  className="bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  Home Run
                </button>
                <button
                  onClick={() => recordHit('fielders-choice')}
                  className="bg-yellow-600 text-white p-3 rounded hover:bg-yellow-700"
                >
                  Fielder's Choice
                </button>
                <button
                  onClick={() => recordHit('error')}
                  className="bg-orange-600 text-white p-3 rounded hover:bg-orange-700"
                >
                  Error
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Record Out</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => recordOut('strikeout')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  Strikeout
                </button>
                <button
                  onClick={() => recordOut('groundout')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  Groundout
                </button>
                <button
                  onClick={() => recordOut('flyout')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  Flyout
                </button>
                <button
                  onClick={() => recordOut('popout')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  Popout
                </button>
                <button
                  onClick={() => recordOut('lineout')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  Lineout
                </button>
                <button
                  onClick={() => recordOut('fielders-choice')}
                  className="bg-red-600 text-white p-3 rounded hover:bg-red-700"
                >
                  FC Out
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Record Walk</h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => recordWalk('walk')}
                  className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  Walk
                </button>
                <button
                  onClick={() => recordWalk('hbp')}
                  className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  HBP
                </button>
                <button
                  onClick={() => recordWalk('intentional-walk')}
                  className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
                >
                  Intentional Walk
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Pitch Count</h3>
              <button
                onClick={addPitch}
                className="bg-purple-600 text-white p-3 rounded hover:bg-purple-700"
              >
                +1 Pitch
              </button>
            </div>
          </div>

          {/* Current Pitcher Stats */}
          {gameStats.pitchers.find(p => p.isCurrentPitcher) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Pitcher Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Pitches:</span> {gameStats.pitchers.find(p => p.isCurrentPitcher)?.pitchesThrown}
                </div>
                <div>
                  <span className="font-medium">Strikeouts:</span> {gameStats.pitchers.find(p => p.isCurrentPitcher)?.strikeouts}
                </div>
                <div>
                  <span className="font-medium">Walks:</span> {gameStats.pitchers.find(p => p.isCurrentPitcher)?.walks}
                </div>
                <div>
                  <span className="font-medium">Hits Allowed:</span> {gameStats.pitchers.find(p => p.isCurrentPitcher)?.hitsAllowed}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameStatsComponent;

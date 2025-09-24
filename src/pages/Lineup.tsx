import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { sampleGame, samplePlayers, samplePlayerCombinations } from '../data/sampleData';
import { LineupGenerator, calculateLineupStats } from '../utils/lineupGenerator';
import type { Lineup, Player, Game } from '../types';

const LineupPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [lineup, setLineup] = useState<Lineup | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [players] = useState<Player[]>(samplePlayers);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // In a real app, you'd fetch this data based on gameId
    setGame(sampleGame);
  }, [gameId]);

  const generateLineup = () => {
    if (!game) return;
    
    setIsGenerating(true);
    
    // Simulate generation time
    setTimeout(() => {
      const generator = new LineupGenerator(players, game, samplePlayerCombinations);
      const newLineup = generator.generateLineup();
      setLineup(newLineup);
      setIsGenerating(false);
    }, 1000);
  };

  const getPositionBadgeClass = (position: string) => {
    if (position === 'P') return 'position-pitcher';
    if (position === 'C') return 'position-catcher';
    if (['1B', '2B', 'SS', '3B'].includes(position)) return 'position-infield';
    return 'position-outfield';
  };

  if (!game) {
    return <div className="text-center py-8">Loading game...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lineup</h1>
          <p className="text-gray-600 mt-2">
            {game.opponent} • {game.date.toLocaleDateString()} • {game.innings} innings
          </p>
        </div>
        <button 
          onClick={generateLineup}
          disabled={isGenerating}
          className="btn-primary"
        >
          {isGenerating ? 'Generating...' : 'Generate Lineup'}
        </button>
      </div>

      {lineup && (
        <>
          {/* Lineup Stats */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Lineup Statistics</h2>
            <LineupStats lineup={lineup} players={players} />
          </div>

          {/* Inning-by-Inning Lineup */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Inning Lineups</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {lineup.innings.map((inning) => (
                <div key={inning.inning} className="card">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    Inning {inning.inning}
                  </h3>
                  
                  <div className="space-y-3">
                    {inning.positions.map((pos) => (
                      <div key={pos.position} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{pos.position}</span>
                        <span className="text-sm text-gray-600">{pos.playerName}</span>
                        <span className={`position-badge ${getPositionBadgeClass(pos.position)}`}>
                          {pos.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Field Diagram */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Field Positions</h2>
            <FieldDiagram lineup={lineup} />
          </div>
        </>
      )}

      {!lineup && !isGenerating && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚾</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lineup Generated</h3>
          <p className="text-gray-600 mb-6">Click "Generate Lineup" to create a lineup for this game.</p>
          <button onClick={generateLineup} className="btn-primary">
            Generate Lineup
          </button>
        </div>
      )}
    </div>
  );
};

interface LineupStatsProps {
  lineup: Lineup;
  players: Player[];
}

const LineupStats: React.FC<LineupStatsProps> = ({ lineup, players }) => {
  const stats = calculateLineupStats(lineup, players);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Infield
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Outfield
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pitching
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stats.map((stat) => (
            <tr key={stat.playerId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {stat.playerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {stat.infieldInnings}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {stat.outfieldInnings}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {stat.pitchingInnings}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {stat.totalInnings}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface FieldDiagramProps {
  lineup: Lineup;
}

const FieldDiagram: React.FC<FieldDiagramProps> = ({ lineup: _lineup }) => {
  // This is a simplified field diagram - in a real app you'd want a more visual representation
  // const currentInning = lineup.innings[0]; // Show first inning as example

  return (
    <div className="max-w-md mx-auto">
      <div className="relative bg-baseball-green rounded-full w-80 h-80 mx-auto">
        {/* Pitcher */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          P
        </div>
        
        {/* Catcher */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          C
        </div>
        
        {/* Infield */}
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          1B
        </div>
        <div className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          2B
        </div>
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          SS
        </div>
        <div className="absolute top-16 right-1/2 transform translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          3B
        </div>
        
        {/* Outfield */}
        <div className="absolute top-8 left-16 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          LF
        </div>
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          CF
        </div>
        <div className="absolute top-8 right-16 bg-white rounded-full w-12 h-12 flex items-center justify-center text-xs font-bold">
          RF
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        Field positions for Inning 1
      </div>
    </div>
  );
};

export default LineupPage;

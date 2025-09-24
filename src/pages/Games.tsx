import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { sampleGame, sampleTeam } from '../data/sampleData';
import { Game, GameStats } from '../types';
import GameStatsComponent from '../components/GameStats';

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([sampleGame]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [trackingGameId, setTrackingGameId] = useState<string | null>(null);
  const [gameStats, setGameStats] = useState<GameStats | null>(null);

  const handleAddGame = (newGame: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => {
    const game: Game = {
      ...newGame,
      id: `game-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setGames([...games, game]);
    setShowAddForm(false);
  };

  const handleDeleteGame = (gameId: string) => {
    setGames(games.filter(g => g.id !== gameId));
  };

  const handleStartTracking = (gameId: string) => {
    setTrackingGameId(gameId);
  };

  const handleStopTracking = () => {
    setTrackingGameId(null);
    setGameStats(null);
  };

  const handleStatsUpdate = (stats: GameStats) => {
    setGameStats(stats);
    // Here you could save to localStorage or send to a backend
    localStorage.setItem(`gameStats-${stats.gameId}`, JSON.stringify(stats));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Games</h1>
          <p className="text-gray-600 mt-2">Manage your game schedule</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Schedule Game
        </button>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {sampleTeam.name} vs {game.opponent}
                    </h3>
                    <p className="text-gray-600">
                      {game.date.toLocaleDateString()} • {game.innings} innings
                    </p>
                    <p className="text-sm text-gray-500">
                      {game.availablePlayers.length} players available
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link 
                  to={`/lineup/${game.id}`}
                  className="btn-primary"
                >
                  Generate Lineup
                </Link>
                <button
                  onClick={() => handleStartTracking(game.id)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                >
                  📊 Track Game
                </button>
                <button
                  onClick={() => handleDeleteGame(game.id)}
                  className="text-gray-400 hover:text-red-600 p-2"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Game Modal */}
      {showAddForm && (
        <GameForm
          onSubmit={handleAddGame}
          onCancel={() => setShowAddForm(false)}
          availablePlayers={sampleTeam.players}
        />
      )}

      {/* Game Stats Tracking */}
      {trackingGameId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">Game Stats Tracking</h2>
              <button
                onClick={handleStopTracking}
                className="text-gray-400 hover:text-red-600 text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <GameStatsComponent
                gameId={trackingGameId}
                teamName={sampleTeam.name}
                opponentName={games.find(g => g.id === trackingGameId)?.opponent || 'Opponent'}
                availablePlayers={sampleTeam.players}
                onStatsUpdate={handleStatsUpdate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface GameFormProps {
  onSubmit: (game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  availablePlayers: any[];
}

const GameForm: React.FC<GameFormProps> = ({ onSubmit, onCancel, availablePlayers }) => {
  const [formData, setFormData] = useState({
    opponent: '',
    date: new Date().toISOString().split('T')[0],
    innings: 6,
    availablePlayers: availablePlayers.map(p => p.id),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      teamId: 'team-1', // This would come from context in a real app
      date: new Date(formData.date),
    });
  };

  const togglePlayerAvailability = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      availablePlayers: prev.availablePlayers.includes(playerId)
        ? prev.availablePlayers.filter(id => id !== playerId)
        : [...prev.availablePlayers, playerId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Schedule New Game</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opponent
              </label>
              <input
                type="text"
                value={formData.opponent}
                onChange={(e) => setFormData(prev => ({ ...prev, opponent: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Innings
            </label>
            <select
              value={formData.innings}
              onChange={(e) => setFormData(prev => ({ ...prev, innings: parseInt(e.target.value) }))}
              className="input-field"
            >
              <option value={5}>5 innings</option>
              <option value={6}>6 innings</option>
              <option value={7}>7 innings</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Players
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-300 rounded-md p-3">
              {availablePlayers.map((player) => (
                <label key={player.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.availablePlayers.includes(player.id)}
                    onChange={() => togglePlayerAvailability(player.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{player.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              Schedule Game
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Games;

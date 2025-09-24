import React, { useState } from 'react';
import { samplePlayers } from '../data/sampleData';
import type { Player, Position } from '../types';

const Players: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(samplePlayers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  const handleAddPlayer = (newPlayer: Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    const player: Player = {
      ...newPlayer,
      id: `player-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setPlayers([...players, player]);
    setShowAddForm(false);
  };

  const handleEditPlayer = (updatedPlayer: Player | Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => {
    if ('id' in updatedPlayer) {
      setPlayers(players.map(p => p.id === updatedPlayer.id ? updatedPlayer as Player : p));
    }
    setEditingPlayer(null);
  };

  const handleDeletePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const getPositionBadgeClass = (position: Position) => {
    if (position === 'P') return 'position-pitcher';
    if (position === 'C') return 'position-catcher';
    if (['1B', '2B', 'SS', '3B'].includes(position)) return 'position-infield';
    return 'position-outfield';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Players</h1>
          <p className="text-gray-600 mt-2">Manage your team roster</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn-primary"
        >
          Add Player
        </button>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div key={player.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
                <div className="flex space-x-2 mt-2">
                  {player.isPitcher && (
                    <span className="position-badge position-pitcher">Pitcher</span>
                  )}
                  {player.isCatcher && (
                    <span className="position-badge position-catcher">Catcher</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setEditingPlayer(player)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeletePlayer(player.id)}
                  className="text-gray-400 hover:text-red-600"
                >
                  🗑️
                </button>
              </div>
            </div>

            {player.excludedPositions.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Excluded Positions:</p>
                <div className="flex flex-wrap gap-1">
                  {player.excludedPositions.map((position) => (
                    <span 
                      key={position}
                      className={`position-badge ${getPositionBadgeClass(position)}`}
                    >
                      {position}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              Added {player.createdAt.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Add Player Modal */}
      {showAddForm && (
        <PlayerForm
          onSubmit={handleAddPlayer}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {/* Edit Player Modal */}
      {editingPlayer && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handleEditPlayer}
          onCancel={() => setEditingPlayer(null)}
        />
      )}
    </div>
  );
};

interface PlayerFormProps {
  player?: Player;
  onSubmit: (player: Player | Omit<Player, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ player, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: player?.name || '',
    isPitcher: player?.isPitcher || false,
    isCatcher: player?.isCatcher || false,
    excludedPositions: player?.excludedPositions || [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      teamId: 'team-1', // This would come from context in a real app
      updatedAt: new Date(),
    });
  };

  const toggleExcludedPosition = (position: Position) => {
    setFormData(prev => ({
      ...prev,
      excludedPositions: prev.excludedPositions.includes(position)
        ? prev.excludedPositions.filter(p => p !== position)
        : [...prev.excludedPositions, position]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {player ? 'Edit Player' : 'Add Player'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Player Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Special Roles</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPitcher}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPitcher: e.target.checked }))}
                  className="mr-2"
                />
                Pitcher
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isCatcher}
                  onChange={(e) => setFormData(prev => ({ ...prev, isCatcher: e.target.checked }))}
                  className="mr-2"
                />
                Catcher
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excluded Positions
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['1B', '2B', 'SS', '3B', 'LF', 'CF', 'RF', 'P', 'C'].map((position) => (
                <button
                  key={position}
                  type="button"
                  onClick={() => toggleExcludedPosition(position as Position)}
                  className={`p-2 text-sm rounded border ${
                    formData.excludedPositions.includes(position as Position)
                      ? 'bg-red-100 border-red-300 text-red-800'
                      : 'bg-gray-100 border-gray-300 text-gray-800'
                  }`}
                >
                  {position}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="btn-primary flex-1">
              {player ? 'Update' : 'Add'} Player
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

export default Players;

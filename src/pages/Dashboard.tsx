import React from 'react';
import { Link } from 'react-router-dom';
import { sampleTeam, sampleGame } from '../data/sampleData';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, Coach!</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/players" className="btn-primary">
            Manage Players
          </Link>
          <Link to="/games" className="btn-primary">
            Schedule Game
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Total Players</h3>
              <p className="text-3xl font-bold text-blue-600">{sampleTeam.players.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">⚾</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Pitchers</h3>
              <p className="text-3xl font-bold text-green-600">
                {sampleTeam.players.filter(p => p.isPitcher).length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🥎</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Catchers</h3>
              <p className="text-3xl font-bold text-purple-600">
                {sampleTeam.players.filter(p => p.isCatcher).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Games */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Games</h2>
          <Link to="/games" className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-900">{sampleTeam.name} vs {sampleGame.opponent}</h3>
              <p className="text-gray-600">{sampleGame.date.toLocaleDateString()}</p>
            </div>
            <div className="flex space-x-2">
              <Link 
                to={`/lineup/${sampleGame.id}`}
                className="btn-primary text-sm"
              >
                View Lineup
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link 
            to="/players" 
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="text-4xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900">Manage Players</h3>
            <p className="text-gray-600 text-sm">Add, edit, or remove players from your team</p>
          </Link>
          
          <Link 
            to="/games" 
            className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <div className="text-4xl mb-2">⚾</div>
            <h3 className="font-semibold text-gray-900">Schedule Game</h3>
            <p className="text-gray-600 text-sm">Create a new game and generate lineups</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

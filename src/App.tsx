import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Players from './pages/Players';
import Games from './pages/Games';
import Lineup from './pages/Lineup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/players" element={<Players />} />
            <Route path="/games" element={<Games />} />
            <Route path="/lineup/:gameId" element={<Lineup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

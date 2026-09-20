import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Purono ba onno app-er sokol data clear kore dibe
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">NewsPortal</Link>
        <nav className="flex gap-6 items-center font-medium text-gray-700">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/news" className="hover:text-blue-600">All News</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
          {token ? (
            <>
              <Link to="/create-news" className="hover:text-blue-600">Create News</Link>
              <Link to="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Dashboard</Link>
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
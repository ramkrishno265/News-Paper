import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
        
        {/* Logo */}
        <Link 
          to="/" 
          onClick={closeMenu}
          className="text-2xl font-serif font-bold text-slate-900 tracking-tight flex items-center gap-2"
        >
          News<span className="text-blue-600">Portal</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition">Home</Link>
          <Link to="/news" className="hover:text-blue-600 transition">All News</Link>
          <Link to="/contact" className="hover:text-blue-600 transition">Contact Us</Link>
          
          {token && (
            <Link to="/create-news" className="hover:text-blue-600 transition">Create News</Link>
          )}
        </nav>

        {/* Desktop Auth / Dashboard Actions */}
        <div className="hidden md:flex items-center gap-4">
          {token ? (
            <>
              <Link 
                to="/dashboard" 
                className="bg-slate-100 text-slate-800 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
              >
                Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className="bg-rose-50 text-rose-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/25"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 focus:outline-none transition"
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl px-6 py-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-3 font-medium text-slate-700">
            <Link 
              to="/" 
              onClick={closeMenu} 
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link 
              to="/news" 
              onClick={closeMenu} 
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition"
            >
              All News
            </Link>
            <Link 
              to="/contact" 
              onClick={closeMenu} 
              className="p-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition"
            >
              Contact Us
            </Link>
            {token && (
              <Link 
                to="/create-news" 
                onClick={closeMenu} 
                className="p-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition"
              >
                Create News
              </Link>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            {token ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={closeMenu}
                  className="w-full text-center bg-slate-100 text-slate-800 py-3 rounded-xl text-sm font-semibold hover:bg-slate-200 transition"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { closeMenu(); handleLogout(); }} 
                  className="w-full text-center bg-rose-50 text-rose-600 py-3 rounded-xl text-sm font-semibold hover:bg-rose-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                onClick={closeMenu}
                className="w-full text-center bg-blue-600 text-white py-3 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-md shadow-blue-600/25"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
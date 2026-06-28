import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Shield, LogOut } from 'lucide-react';
import duckMascot from '../assets/duck-mascot-nobg.png';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`border-b backdrop-blur-xl sticky top-0 z-50 ${isAdmin ? 'border-red-500/20 bg-[#0a0a0f]/95' : 'border-white/10 bg-[#0B0B0F]/90'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={isLoggedIn ? (isAdmin ? '/admin' : '/home') : '/'} className="flex items-center gap-4 group">
          <img src={duckMascot} alt="DuckStation" className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] transition-all transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none text-white">DuckStation</span>
            {isAdmin
              ? <span className="text-[10px] font-bold text-red-400 tracking-widest uppercase mt-1 flex items-center gap-1"><Shield size={9}/> Admin Panel</span>
              : <span className="text-[10px] font-bold text-brand-accent tracking-widest uppercase mt-1">Trading Hub</span>
            }
          </div>
        </Link>
        
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {isAdmin ? (
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
                    <Shield size={12} className="text-red-400" />
                    <span className="text-xs font-bold text-red-400">ADMIN</span>
                  </div>
                  <Link to="/dashboard" className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-colors">
                    User View
                  </Link>
                </>
              ) : (
                <>
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5865F2]/10 border border-[#5865F2]/20">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-semibold text-[#5865F2]">{user?.name || 'User'}</span>
                  </div>
                  <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all text-sm border border-white/5">
                    Dashboard
                  </Link>
                </>
              )}
              <button onClick={handleLogout}
                className="p-2 rounded-xl hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <>
              <Link to="/" className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium text-gray-300">
                Login
              </Link>
              <Link to="/" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold transition-all shadow-[0_0_15px_rgba(88,101,242,0.3)] text-sm">
                <MessageSquare size={16} />
                Discord
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

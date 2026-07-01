import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Shield, LogOut, Bell } from 'lucide-react';
import duckMascot from '../assets/duck-mascot-nobg.png';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';
import api from '../services/api';

const Navbar = ({ isAdmin = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const { lang, setLang } = useLang();
  const [notifs, setNotifs] = useState([]);
  const [unread, setUnread] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchNotifs = async () => {
      try {
        const res = await api.getNotifications();
        if (res.success) { setNotifs(res.notifications || []); setUnread(res.unread || 0); }
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  useEffect(() => {
    const handleClick = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (!user?.role) return null;
    if (user.role === 'admin') {
      return <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-bold">Admin</span>;
    }
    if (user.role === 'guest') {
      return <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">Guest</span>;
    }
    return <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">{user.role}</span>;
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
               <LanguageSelector />
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
                    {getRoleBadge()}
                  </div>
                  <Link to="/dashboard" className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all text-sm border border-white/5">
                    Dashboard
                  </Link>
                </>
              )}
              <div ref={notifRef} className="relative">
                <button onClick={() => setShowNotifs(!showNotifs)} className="relative p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                  <Bell size={18} />
                  {unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">{unread > 9 ? '9+' : unread}</span>}
                </button>
                {showNotifs && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                      <h4 className="font-bold text-sm">Notifikasi</h4>
                      {unread > 0 && <button onClick={async () => { await api.markAllRead(); setUnread(0); setNotifs(n => n.map(x => ({...x, read: true}))); }} className="text-[10px] text-brand-primary font-bold hover:underline">Tandai semua dibaca</button>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <p className="p-6 text-center text-gray-500 text-sm">Belum ada notifikasi</p>
                      ) : notifs.map(n => (
                        <div key={n._id} className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-brand-primary/5' : ''}`} onClick={async () => { if (!n.read) { await api.markNotifRead(n._id); setUnread(u => Math.max(0, u - 1)); setNotifs(prev => prev.map(x => x._id === n._id ? {...x, read: true} : x)); } if (n.link) { navigate(n.link); setShowNotifs(false); } }}>
                          <div className="flex items-start gap-2">
                            {!n.read && <div className="w-2 h-2 rounded-full bg-brand-primary shrink-0 mt-1.5"></div>}
                            <div className={!n.read ? '' : 'ml-4'}>
                              <p className="text-xs font-bold text-white">{n.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                              <p className="text-[10px] text-gray-600 mt-1">{new Date(n.createdAt).toLocaleString('id-ID')}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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

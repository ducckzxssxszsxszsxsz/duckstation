import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { BookOpen, Calendar, CheckSquare, MessageSquare, Shield, DollarSign, Crown, Play, Lock, ChevronRight, User, Settings, LogOut, Bell, AlertTriangle, RotateCcw, CheckCircle, Clock, ArrowRight, Menu, X, BarChart3, Mail } from 'lucide-react';
import BookingPage from './BookingPage';
import HomeworkPage from './HomeworkPage';
import TicketingPage from './TicketingPage';
import BatchSelection from './BatchSelection';
import HowToStart from './HowToStart';
import JournalPage from './JournalPage';
import MessagesPage from './MessagesPage';
import ModuleDetail from './ModuleDetail';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import api from '../services/api';

const SidebarLink = ({ to, icon: Icon, label, active, onClick, disabled }) => (
  <Link 
    to={disabled ? '#' : to}
    onClick={disabled ? (e) => e.preventDefault() : onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      disabled ? 'opacity-40 cursor-not-allowed' :
      active 
        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
    {disabled && <Lock size={14} className="ml-auto text-gray-500" />}
  </Link>
);

const DashboardHome = () => {
  const navigate = useNavigate();
  const { t } = useLang();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isGuest = user?.role === 'guest';

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const res = await api.getModules();
        if (res.success && res.modules) {
          setModules(res.modules);
        }
      } catch (err) {
        console.error('Failed to fetch modules:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, []);

  const visibleModules = isGuest ? modules.filter(m => m.free === true) : modules;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black mb-1">{t('dash.modules')} 📚</h2>
          <p className="text-gray-400 text-sm sm:text-base">{t('dash.modules_desc')}</p>
        </div>
        <button onClick={() => navigate('/dashboard/how-to')}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl text-sm font-medium transition-colors self-start sm:self-auto">
          <ArrowRight size={14} /> {t('dash.how_to')}
        </button>
      </div>

      {/* Guest Banner */}
      {isGuest && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl flex items-center gap-3">
          <AlertTriangle size={20} className="text-yellow-400 shrink-0" />
          <div>
            <p className="text-yellow-300 font-bold text-sm">{t('dash.guest_banner')}</p>
          </div>
          <button onClick={() => navigate('/dashboard/batches')}
            className="ml-auto px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-xs hover:bg-yellow-400 transition-colors shrink-0">
                {t('dash.join_class')}
          </button>
        </div>
      )}

      {/* Modules */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 text-center text-gray-400">{t('dash.loading')}</div>
        ) : visibleModules.length === 0 ? (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 text-center text-gray-400">
            <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
            <p>{t('dash.no_modules')}</p>
          </div>
        ) : (
          visibleModules.map((mod) => (
            <div key={mod._id}
              className={`border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-all group ${
                mod.free
                  ? 'bg-brand-secondary border-white/10 hover:border-brand-primary/50 shadow-lg cursor-pointer'
                  : 'bg-brand-secondary/40 border-white/5 relative overflow-hidden'
              }`}>
              {!mod.free && (
                <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => navigate('/dashboard/batches')}
                    className="flex items-center gap-2 bg-brand-primary text-brand-dark px-6 py-2 rounded-lg font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-sm">
                    <Lock size={16} /> {t('dash.premium')} Access
                  </button>
                </div>
              )}
              <div className={`flex items-center gap-4 mb-4 sm:mb-0 ${!mod.free ? 'opacity-50 relative z-0' : ''}`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                  mod.free
                    ? 'bg-brand-primary/10 text-brand-primary group-hover:scale-110'
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {mod.free ? <Play size={22} className="ml-1" /> : <Lock size={22} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase tracking-wider ${mod.free ? 'text-brand-primary' : 'text-gray-500'}`}>{mod.title}</span>
                    {mod.free ? (
                      <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/20">{t('dash.free')}</span>
                    ) : (
                      <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full font-bold border border-brand-primary/20">Premium</span>
                    )}
                  </div>
                  <h4 className={`font-bold text-base sm:text-lg ${!mod.free ? 'text-gray-300' : ''}`}>{mod.title}</h4>
                  <p className={`text-xs sm:text-sm ${mod.free ? 'text-gray-400' : 'text-gray-500'}`}>{mod.lessons?.length || 0} {t('dash.lessons')} • {t('dash.batch')}: {mod.batch || 'Semua'}</p>
                </div>
              </div>
              {mod.free || !isGuest ? (
                <button onClick={() => navigate(`/dashboard/module/${mod._id}`)} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors border border-white/10 w-full sm:w-auto text-sm">
                  {t('dash.start_learning')} <ChevronRight size={16} />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-2 text-gray-500 font-medium z-0"><Lock size={16} /> {t('dash.locked')}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const UserSettings = () => {
  const { user } = useAuth();
  const { t } = useLang();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegram, setTelegram] = useState('');
  const [experience, setExperience] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.getMe();
        if (res.success && res.user) {
          setName(res.user.name || '');
          setEmail(res.user.email || '');
          setTelegram(res.user.telegram || '');
          setExperience(res.user.experience || '');
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await api.updateProfile({ telegram, experience });
      if (res.success) {
        setMessage(t('settings.saved'));
      } else {
        setMessage(res.message || 'Gagal menyimpan profil.');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{t('settings.title')}</h2>
        <p className="text-gray-400 text-sm sm:text-base">{t('settings.desc')}</p>
      </div>

      <div className="space-y-6">
        {/* Subscription Info */}
        {user?.role !== 'guest' && user?.role !== 'admin' && (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4">{t('settings.subscription')}</h3>
            <div className="flex items-center gap-3 p-4 bg-brand-dark border border-white/5 rounded-xl">
              <div className={`p-2 rounded-lg ${user?.roleExpiry && new Date(user.roleExpiry) < new Date() ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                <Crown size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">{t('settings.role')}: {user?.role}</p>
                {user?.roleExpiry ? (
                  new Date(user.roleExpiry) < new Date()
                    ? <p className="text-xs text-red-400">Expired</p>
                    : <p className="text-xs text-green-400">{t('settings.expires')}: {new Date(user.roleExpiry).toLocaleDateString('id-ID')} — {t('settings.remaining')} {Math.max(0, Math.ceil((new Date(user.roleExpiry) - new Date()) / (1000*60*60*24)))} {t('settings.days')}</p>
                ) : (
                  <p className="text-xs text-gray-400">Tanpa batas waktu</p>
                )}
              </div>
            </div>
          </div>
        )}

        {user?.role === 'guest' && (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-3 p-4 bg-brand-dark border border-white/5 rounded-xl">
              <AlertTriangle size={20} className="text-yellow-400 shrink-0" />
              <div className="flex-grow">
                <p className="font-bold text-sm text-yellow-300">{t('settings.no_sub')}</p>
                <p className="text-xs text-gray-400">Pilih batch untuk membuka akses materi dan fitur premium.</p>
              </div>
              <button onClick={() => window.location.href = '/dashboard/batches'}
                className="px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-xs hover:bg-yellow-400 transition-colors shrink-0">
            {t('dash.join_class')}
              </button>
            </div>
          </div>
        )}
        {/* Profil Dasar */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">{t('settings.profile')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('settings.name')}</label>
              <input type="text" value={name} disabled className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-not-allowed text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('settings.email')} (Google Login)</label>
              <input type="email" disabled value={email} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-gray-300 cursor-not-allowed text-sm" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('settings.telegram')} ({t('settings.telegram_hint')})</label>
              <div className="flex relative">
                <span className="absolute left-4 top-3 text-gray-500">@</span>
                <input type="text" placeholder="username_telegram" value={telegram}
                  onChange={e => setTelegram(e.target.value)}
                  className="w-full bg-brand-dark border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 transition-colors text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">{t('settings.experience')}</label>
              <select value={experience} onChange={e => setExperience(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/60 transition-colors">
                <option value="">Pilih pengalaman...</option>
                <option>Pemula (belum pernah trading)</option>
                <option>Beginner (sudah coba tapi belum konsisten)</option>
                <option>Intermediate (sudah beberapa bulan)</option>
              </select>
            </div>
            {message && <p className={`text-sm font-bold ${message.includes('berhasil') ? 'text-green-400' : 'text-red-400'}`}>{message}</p>}
            <button onClick={handleSave} disabled={saving}
              className="px-6 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50">
              {saving ? t('settings.saving') : t('settings.save')}
            </button>
          </div>
        </div>

        {/* Integrasi Discord */}
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4">{t('settings.discord_title')}</h3>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-brand-dark border border-white/5 rounded-xl gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#5865F2]/10 text-[#5865F2] rounded-lg"><MessageSquare size={20} /></div>
                <div>
                  <p className="font-bold text-sm">{t('enroll.discord_account')}</p>
                  <p className="text-xs text-gray-400">{t('settings.discord_hint')}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold rounded-lg text-sm transition-colors self-start sm:self-auto">
                {t('settings.discord_authorize')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t } = useLang();
  const isGuest = user?.role === 'guest';
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    api.getMessages().then(res => {
      if (res.success) setUnreadMessages(res.unread || 0);
    }).catch(() => {});
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-[calc(100vh-73px)] relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-brand-secondary/50 border-r border-white/10 flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="flex-grow overflow-y-auto p-4 space-y-1 scrollbar-hide">
          {/* Mobile close button */}
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="font-bold text-white">Menu</span>
            <button onClick={closeSidebar} className="p-1 rounded-lg hover:bg-white/10 text-gray-400">
              <X size={20} />
            </button>
          </div>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-4 mt-2 hidden md:block">Menu Utama</div>
          <SidebarLink to="/dashboard" icon={BookOpen} label={t('dash.sidebar_modules')} active={currentPath === '/dashboard'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/how-to" icon={ArrowRight} label={t('dash.sidebar_howto')} active={currentPath === '/dashboard/how-to'} onClick={closeSidebar} />
          <SidebarLink to="/dashboard/batches" icon={DollarSign} label={t('dash.sidebar_batches')} active={currentPath === '/dashboard/batches'} onClick={closeSidebar} />
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-3 px-4 hidden md:block">Interaksi</div>
          <SidebarLink to="/dashboard/booking" icon={Calendar} label={t('dash.sidebar_booking')} active={currentPath === '/dashboard/booking'} onClick={closeSidebar} disabled={isGuest} />
          <SidebarLink to="/dashboard/homework" icon={CheckSquare} label={t('dash.sidebar_homework')} active={currentPath === '/dashboard/homework'} onClick={closeSidebar} disabled={isGuest} />
          <SidebarLink to="/dashboard/journal" icon={BarChart3} label={t('dash.sidebar_journal')} active={currentPath === '/dashboard/journal'} onClick={closeSidebar} disabled={isGuest} />
          <SidebarLink to="/dashboard/tickets" icon={MessageSquare} label={t('dash.sidebar_tickets')} active={currentPath === '/dashboard/tickets'} onClick={closeSidebar} />
          <div className="relative">
            <SidebarLink to="/dashboard/messages" icon={Mail} label={t('dash.sidebar_messages')} active={currentPath === '/dashboard/messages'} onClick={closeSidebar} />
            {unreadMessages > 0 && (
              <span className="absolute top-1.5 right-2 w-5 h-5 bg-brand-primary text-brand-dark text-[10px] font-bold rounded-full flex items-center justify-center">{unreadMessages > 9 ? '9+' : unreadMessages}</span>
            )}
          </div>
          
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-6 mb-3 px-4 hidden md:block">Akun Saya</div>
          <SidebarLink to="/dashboard/settings" icon={Settings} label={t('dash.sidebar_settings')} active={currentPath === '/dashboard/settings'} onClick={closeSidebar} />
        </div>
        
        {/* User Mini Profile di Bawah Sidebar */}
        <div className="p-4 border-t border-white/10 bg-brand-secondary/30">
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-brand-primary relative shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#1A1A24] rounded-full"></span>
              </div>
              <div>
                <p className="font-medium text-sm truncate max-w-[90px]">{user?.name || 'Guest User'}</p>
                {user?.role === 'guest' ? (
                  <p className="text-[10px] text-gray-500 font-semibold">{t('nav.guest')} — {t('settings.no_sub')}</p>
                ) : user?.roleExpiry ? (
                  new Date(user.roleExpiry) < new Date()
                    ? <p className="text-[10px] text-red-400 font-semibold">Role: {user.role} — Expired</p>
                    : <p className="text-[10px] text-green-400 font-semibold">Sisa {Math.max(0, Math.ceil((new Date(user.roleExpiry) - new Date()) / (1000*60*60*24)))} hari</p>
                ) : (
                  <p className="text-[10px] text-gray-500 font-semibold">{user?.role || 'User'}</p>
                )}
              </div>
            </div>
            <button onClick={logout} className="text-gray-500 group-hover:text-red-400 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto bg-brand-dark">
        {/* Mobile Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-brand-secondary/30 md:hidden sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-white/10 text-gray-300">
            <Menu size={22} />
          </button>
          <span className="font-bold text-sm">DuckStation</span>
          <div className="w-9" />
        </div>
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/how-to" element={<HowToStart />} />
          <Route path="/batches" element={<BatchSelection />} />
          <Route path="/booking" element={isGuest ? <Navigate to="/dashboard/batches" replace /> : <BookingPage />} />
          <Route path="/homework" element={isGuest ? <Navigate to="/dashboard/batches" replace /> : <HomeworkPage />} />
          <Route path="/journal" element={isGuest ? <Navigate to="/dashboard/batches" replace /> : <JournalPage />} />
          <Route path="/module/:id" element={<ModuleDetail />} />
          <Route path="/tickets" element={<TicketingPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="*" element={<div className="p-8 text-gray-400 flex items-center justify-center h-full">Modul ini sedang dalam tahap pengembangan (WIP).</div>} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Shield, Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import duckMascot from '../assets/duck-mascot-nobg.png';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/auth/google`;
  };

  const handleDiscordLogin = () => {
    setShowLoginForm(true);
  };

  const handleGoogleSuccess = (data) => {
    login(data.token, data.user);
    navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success) {
        login(res.token, res.user);
        navigate(res.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(res.message || 'Email atau password salah');
      }
    } catch {
      setError('Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      {/* Glow Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/8 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[15%] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">

        {/* Kiri: Mascot 3D */}
        <div className="relative flex-1 flex justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-primary/15 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="absolute top-10 left-10 w-2 h-2 bg-brand-primary rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-16 left-16 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-50"></div>
          <div className="absolute bottom-32 right-10 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-30"></div>

          <img
            src={duckMascot}
            alt="DuckStation 3D Mascot"
            className="relative z-10 w-[280px] md:w-[380px] lg:w-[450px] h-auto drop-shadow-[0_20px_60px_rgba(255,215,0,0.25)] hover:drop-shadow-[0_30px_80px_rgba(255,215,0,0.4)] transition-all duration-700 hover:scale-105 hover:-translate-y-2 cursor-pointer"
            onClick={handleLogin}
          />

          <div className="absolute bottom-8 left-8 md:left-12 bg-brand-secondary/80 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 shadow-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-300 tracking-wider">DISCORD INTEGRATED</span>
            </div>
          </div>

          <div className="absolute top-8 right-8 md:right-12 bg-brand-secondary/80 backdrop-blur-xl border border-brand-primary/20 rounded-xl px-3 py-2 shadow-xl">
            <span className="text-[10px] font-black text-brand-primary tracking-widest">V1.0 LIVE</span>
          </div>
        </div>

        {/* Kanan: Content */}
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold mb-6 backdrop-blur-sm tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            PLATFORM ONLINE
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter leading-[1.05]">
            ENTER THE<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-yellow-300 to-brand-accent">
              DUCK STATION
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 mb-10 max-w-lg leading-relaxed font-light">
            Platform komunitas trading modern. Akses materi eksklusif, komunitas Discord privat, dan real-time market data — semua dalam satu platform.
          </p>

          {/* Login Buttons */}
          {!showLoginForm ? (
            <div className="flex flex-col gap-4 w-full max-w-md mb-10">
              {/* Google Login */}
              <div className="flex-1">
                <GoogleLoginButton />
              </div>

              {/* Discord Login */}
              <button
                onClick={handleDiscordLogin}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white transition-all shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:shadow-[0_0_30px_rgba(88,101,242,0.5)] transform hover:-translate-y-1 font-bold text-base"
              >
                <MessageSquare size={20} />
                Login with Discord
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 text-gray-500 text-xs">
                <div className="flex-1 h-px bg-white/10"></div>
                <span>ATAU</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Email Login Toggle */}
              <button
                onClick={() => setShowLoginForm(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all font-semibold text-sm"
              >
                <Mail size={18} />
                Login dengan Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleEmailLogin} className="w-full max-w-md mb-10">
              <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">Login Email</h3>
                  <button type="button" onClick={() => { setShowLoginForm(false); setError(''); }} className="text-xs text-gray-400 hover:text-white transition-colors">
                    Kembali
                  </button>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@duckstation.com"
                      required
                      className="w-full bg-brand-dark border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-brand-dark border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Masuk <ArrowRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-500 text-center">
                  Belum punya akun? Hubungi admin via Discord.
                </p>
              </div>
            </form>
          )}

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-green-400" />
              <span>Secure Auth</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-brand-accent" />
              <span>Real-time Data</span>
            </div>
            <div className="w-px h-3 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#5865F2] flex items-center justify-center"><span className="text-[6px] text-white font-black">D</span></div>
              <span>Discord Community</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import duckMascot from '../assets/duck-mascot-nobg.png';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const provider = searchParams.get('provider');

    if (token) {
      // Fetch user data dari backend
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(r => r.json())
        .then(data => {
          if (data.success) {
            login(token, data.user);
          }
          setTimeout(() => navigate('/dashboard'), 1000);
        })
        .catch(() => {
          // Fallback — save token aja
          login(token, { name: 'User', role: 'user' });
          setTimeout(() => navigate('/dashboard'), 1000);
        });
    } else {
      setTimeout(() => navigate('/'), 1500);
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
      <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-primary/50 shadow-[0_0_30px_rgba(255,215,0,0.4)] animate-bounce mb-6 bg-gradient-to-b from-brand-secondary to-brand-dark flex items-center justify-center">
        <img src={duckMascot} alt="Loading" className="w-full h-full object-contain scale-110" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
      <p className="text-gray-400">Please wait while we verify your credentials.</p>
    </div>
  );
};

export default AuthCallback;

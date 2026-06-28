import React, { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import api from '../services/api';

const HomeworkPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [quiz, setQuiz] = useState(null);
  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyAttempts().catch(() => ({ success: false })),
      api.getActiveQuiz().catch(() => ({ success: false })),
    ]).then(([attemptsRes, quizRes]) => {
      if (attemptsRes.success) setAttemptData(attemptsRes);
      if (quizRes.success) setQuiz(quizRes.quiz);
    }).finally(() => setLoading(false));
  }, []);

  const attempts = attemptData?.attempts || [];
  const maxAttempts = attemptData?.maxAttempts || 3;
  const minScore = attemptData?.minScore || 70;
  const passed = attemptData?.passed || false;
  const lastScore = attemptData?.lastScore || 0;

  const allItems = [];

  if (quiz) {
    allItems.push({
      id: quiz._id || 'active-quiz',
      title: quiz.title || 'Quiz Pengetahuan Dasar Trading',
      module: quiz.module || 'Modul 1: Fundamental',
      type: 'quiz',
      questions: quiz.questions?.length || 10,
      minScore,
      status: passed ? 'completed' : attempts.length >= maxAttempts && !passed ? 'failed' : attempts.length > 0 ? 'failed' : 'pending',
      score: lastScore || undefined,
      attempts: attempts.length,
      maxAttempts,
    });
  }

  const filtered = allItems.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending' || item.status === 'failed';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  const getScoreColor = (score, min) => score >= min ? 'text-green-400' : 'text-red-400';

  const getStatusBadge = (item) => {
    if (item.status === 'completed') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
          <CheckCircle size={12} /> Selesai
        </span>
      );
    }
    if (item.status === 'failed') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-bold border border-red-500/30">
          <RotateCcw size={12} /> Retake
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-bold border border-yellow-500/30">
        <Clock size={12} /> Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Homework & Quiz</h2>
          <p className="text-gray-400">Memuat data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Homework & Quiz</h2>
        <p className="text-gray-400">Selesaikan tugas wajib untuk membuka modul berikutnya. Skor minimum: {minScore}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Percobaan</p>
          <p className="text-2xl font-bold">{attempts.length}</p>
        </div>
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Status</p>
          <p className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-yellow-400'}`}>{passed ? 'Lulus' : 'Belum Lulus'}</p>
        </div>
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Skor Terakhir</p>
          <p className={`text-2xl font-bold ${lastScore >= minScore ? 'text-green-400' : 'text-red-400'}`}>{lastScore || '-'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'pending' ? 'bg-brand-primary text-brand-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Pending & Retake
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'completed' ? 'bg-brand-primary text-brand-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Selesai
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400">
            <CheckCircle size={48} className="mb-4 text-green-400 opacity-50" />
            <p className="text-lg font-bold text-white mb-1">Semua tugas selesai!</p>
            <p className="text-sm">Kerja bagus, Trader! 🦆</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className={`bg-brand-secondary border rounded-2xl p-5 transition-all hover:border-brand-primary/30 ${
              item.status === 'failed' ? 'border-red-500/30' : 'border-white/10'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    item.status === 'completed'
                      ? 'bg-green-500/10 text-green-400'
                      : item.status === 'failed'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {item.status === 'completed' ? <CheckCircle size={24} /> : item.status === 'failed' ? <AlertTriangle size={24} /> : <CheckSquare size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.module}</span>
                      {item.type === 'quiz' && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">QUIZ</span>
                      )}
                      {getStatusBadge(item)}
                    </div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{item.questions} Soal • Skor Minimum: {item.minScore}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:flex-col md:items-end">
                  {item.score !== undefined && (
                    <div className="text-right">
                      <p className="text-3xl font-black" style={{color: getScoreColor(item.score, item.minScore)}}>{item.score}</p>
                      <p className="text-xs text-gray-500">/ 100</p>
                    </div>
                  )}

                  <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    item.status === 'completed'
                      ? 'bg-white/5 text-gray-400 cursor-default'
                      : item.status === 'failed'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-brand-primary text-brand-dark hover:bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                  }`}>
                    {item.status === 'completed' ? 'Lihat Jawaban' : item.status === 'failed' ? `Retake (${item.attempts}/${item.maxAttempts})` : 'Mulai Kerjakan'}
                  </button>
                </div>
              </div>

              {item.status === 'failed' && (
                <div className="mt-4 pt-4 border-t border-red-500/20 bg-red-500/5 rounded-xl p-3 flex items-center gap-3">
                  <AlertTriangle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">
                    Skor Anda ({item.score || 0}) belum mencapai minimum ({item.minScore}). Sistem mengunci progres modul berikutnya. Silakan ulang kuis ini.
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeworkPage;

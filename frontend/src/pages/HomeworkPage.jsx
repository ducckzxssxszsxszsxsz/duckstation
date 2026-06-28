import React, { useState } from 'react';
import { CheckSquare, Clock, AlertTriangle, CheckCircle, Lock, RotateCcw, Star } from 'lucide-react';

const HomeworkPage = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Simulasi data homework
  const homeworks = [
    {
      id: 1,
      title: 'Identifikasi 5 Pola Candlestick pada Chart GBP/USD',
      module: 'Modul 1: Fundamental',
      dueDate: '2026-07-05',
      status: 'pending',
      minScore: 70,
      maxScore: 100,
      description: 'Analisis chart GBP/USD timeframe H4 dan identifikasi minimal 5 pola candlestick yang berbeda. Sertakan screenshot dan penjelasan.',
      type: 'assignment'
    },
    {
      id: 2,
      title: 'Quiz: Support & Resistance',
      module: 'Modul 1: Fundamental',
      dueDate: '2026-07-03',
      status: 'failed',
      score: 45,
      minScore: 70,
      attempts: 2,
      maxAttempts: 3,
      type: 'quiz',
      questions: 10
    },
    {
      id: 3,
      title: 'Analisis Market Week 28',
      module: 'Modul 1: Fundamental',
      dueDate: '2026-07-01',
      status: 'completed',
      score: 85,
      minScore: 70,
      type: 'assignment'
    },
    {
      id: 4,
      title: 'Quiz: Candlestick Patterns',
      module: 'Modul 1: Fundamental',
      dueDate: '2026-06-28',
      status: 'completed',
      score: 92,
      minScore: 70,
      type: 'quiz',
      questions: 15
    }
  ];

  const filteredHomeworks = homeworks.filter(hw => {
    if (activeTab === 'pending') return hw.status === 'pending' || hw.status === 'failed';
    if (activeTab === 'completed') return hw.status === 'completed';
    return true;
  });

  const getScoreColor = (score, minScore) => {
    if (score >= minScore) return 'text-green-400';
    return 'text-red-400';
  };

  const getStatusBadge = (hw) => {
    if (hw.status === 'completed') {
      return (
        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold border border-green-500/30">
          <CheckCircle size={12} /> Selesai
        </span>
      );
    }
    if (hw.status === 'failed') {
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

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Homework & Quiz</h2>
        <p className="text-gray-400">Selesaikan tugas wajib untuk membuka modul berikutnya. Skor minimum: 70.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Total Tugas</p>
          <p className="text-2xl font-bold">{homeworks.length}</p>
        </div>
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Selesai</p>
          <p className="text-2xl font-bold text-green-400">{homeworks.filter(hw => hw.status === 'completed').length}</p>
        </div>
        <div className="bg-brand-secondary border border-white/10 rounded-xl p-4">
          <p className="text-sm text-gray-400 mb-1">Perlu Dikerjakan</p>
          <p className="text-2xl font-bold text-yellow-400">{homeworks.filter(hw => hw.status !== 'completed').length}</p>
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

      {/* Homework List */}
      <div className="space-y-4">
        {filteredHomeworks.length === 0 ? (
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400">
            <CheckCircle size={48} className="mb-4 text-green-400 opacity-50" />
            <p className="text-lg font-bold text-white mb-1">Semua tugas selesai!</p>
            <p className="text-sm">Kerja bagus, Trader! 🦆</p>
          </div>
        ) : (
          filteredHomeworks.map((hw) => (
            <div key={hw.id} className={`bg-brand-secondary border rounded-2xl p-5 transition-all hover:border-brand-primary/30 ${
              hw.status === 'failed' ? 'border-red-500/30' : 'border-white/10'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    hw.status === 'completed' 
                      ? 'bg-green-500/10 text-green-400' 
                      : hw.status === 'failed'
                      ? 'bg-red-500/10 text-red-400'
                      : 'bg-brand-primary/10 text-brand-primary'
                  }`}>
                    {hw.status === 'completed' ? <CheckCircle size={24} /> : hw.status === 'failed' ? <AlertTriangle size={24} /> : <CheckSquare size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{hw.module}</span>
                      {hw.type === 'quiz' && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold border border-purple-500/30">QUIZ</span>
                      )}
                      {getStatusBadge(hw)}
                    </div>
                    <h4 className="font-bold text-lg">{hw.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{hw.description || `${hw.questions} Soal • Skor Minimum: ${hw.minScore}`}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:flex-col md:items-end">
                  {hw.score !== undefined && (
                    <div className="text-right">
                      <p className="text-3xl font-black" style={{color: getScoreColor(hw.score, hw.minScore)}}>{hw.score}</p>
                      <p className="text-xs text-gray-500">/ {hw.maxScore || 100}</p>
                    </div>
                  )}
                  
                  <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    hw.status === 'completed'
                      ? 'bg-white/5 text-gray-400 cursor-default'
                      : hw.status === 'failed'
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                      : 'bg-brand-primary text-brand-dark hover:bg-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.2)]'
                  }`}>
                    {hw.status === 'completed' ? 'Lihat Jawaban' : hw.status === 'failed' ? `Retake (${hw.attempts}/${hw.maxAttempts})` : 'Mulai Kerjakan'}
                  </button>
                </div>
              </div>
              
              {hw.status === 'failed' && (
                <div className="mt-4 pt-4 border-t border-red-500/20 bg-red-500/5 rounded-xl p-3 flex items-center gap-3">
                  <AlertTriangle size={16} className="text-red-400 shrink-0" />
                  <p className="text-sm text-red-300">
                    Skor Anda ({hw.score}) belum mencapai minimum ({hw.minScore}). Sistem mengunci progres modul berikutnya. Silakan ulang kuis ini.
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
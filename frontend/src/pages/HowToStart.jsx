import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Play, CheckSquare, Calendar, AlertTriangle, RotateCcw, MessageSquare, BookOpen } from 'lucide-react';
import api from '../services/api';

const HowToStart = () => {
  const navigate = useNavigate();
  const [userStatus, setUserStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyAttempts().then(res => {
      if (res.success) {
        setUserStatus({
          quizAttempts: res.attempts?.length || 0,
          maxAttempts: res.maxAttempts || 3,
          quizScore: res.lastScore || 0,
          quizMinScore: res.minScore || 70,
          quizPassed: res.passed || false,
        });
      } else {
        setUserStatus({
          quizAttempts: 0,
          maxAttempts: 3,
          quizScore: 0,
          quizMinScore: 70,
          quizPassed: false,
        });
      }
    }).catch(() => {
      setUserStatus({
        quizAttempts: 0,
        maxAttempts: 3,
        quizScore: 0,
        quizMinScore: 70,
        quizPassed: false,
      });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2">Cara Memulai 🦆</h2>
          <p className="text-gray-400">Memuat data...</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const isQuizBlocked = userStatus.quizAttempts >= userStatus.maxAttempts && !userStatus.quizPassed;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-black mb-2">Cara Memulai 🦆</h2>
        <p className="text-gray-400">Ikuti setiap langkah di bawah secara berurutan untuk memulai perjalanan trading kamu.</p>
      </div>

      {/* STEP TIMELINE */}
      <div className="bg-gradient-to-br from-brand-secondary to-[#1A1A24] border border-white/10 rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="space-y-0">
            {[
              { id: 1, label: 'Daftar & Bayar', desc: 'Isi form pendaftaran & lakukan pembayaran via QRIS atau Transfer.', done: true, icon: '💳' },
              { id: 2, label: 'Menunggu Admin', desc: 'Admin verifikasi pembayaran & approve pendaftaran kamu.', done: false, active: true, icon: '⏳' },
              { id: 3, label: 'Kerjakan Quiz', desc: 'Quiz wajib sebelum akses materi. Min. skor 70, maks 3x percobaan.', done: userStatus.quizPassed, icon: '📝' },
              { id: 4, label: 'Mulai Belajar', desc: 'Akses modul materi berjenjang & kerjakan tugas.', done: false, icon: '📚' },
              { id: 5, label: 'Booking Mentor', desc: 'Jadwalkan sesi 1-on-1 dengan mentor untuk review quiz & materi.', done: false, icon: '🎯' },
            ].map((step, i, arr) => (
              <div key={step.id} className="flex items-start gap-4 relative">
                {i < arr.length - 1 && <div className={`absolute left-[19px] top-[40px] w-px h-[calc(100%-24px)] ${step.done ? 'bg-brand-primary' : 'bg-white/10'}`}></div>}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-base border-2 transition-all ${
                  step.done ? 'bg-brand-primary border-brand-primary' :
                  step.active ? 'border-brand-primary bg-brand-primary/10' :
                  'border-white/10 bg-brand-dark'
                }`}>
                  {step.done ? <CheckCircle size={18} className="text-brand-dark" /> : <span>{step.icon}</span>}
                </div>
                <div className={`pb-6 pt-1 ${!step.done && !step.active ? 'opacity-40' : ''}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black text-gray-600 tracking-widest">STEP {step.id}</span>
                    {step.done && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold border border-green-500/20">SELESAI</span>}
                    {step.active && <span className="text-[10px] bg-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-full font-bold border border-brand-primary/20">AKTIF</span>}
                  </div>
                  <p className={`font-bold text-base ${step.active ? 'text-brand-primary' : step.done ? 'text-white' : 'text-gray-400'}`}>{step.label}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{step.desc}</p>

                  {step.id === 2 && step.active && (
                    <div className="mt-3 bg-brand-dark border border-white/5 rounded-xl px-4 py-3 flex items-center gap-3">
                      <Clock size={14} className="text-yellow-400 shrink-0" />
                      <p className="text-xs text-gray-400">Menunggu admin approve. Hubungi admin via <span className="text-[#5865F2] font-bold">Discord</span> jika lebih dari 1x24 jam.</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUIZ BOX */}
      <div className={`border rounded-2xl overflow-hidden mb-8 transition-all ${userStatus.quizPassed ? 'bg-green-500/5 border-green-500/20' : isQuizBlocked ? 'bg-red-500/5 border-red-500/20' : 'bg-brand-secondary border-white/10'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${userStatus.quizPassed ? 'bg-green-500/15 text-green-400' : isQuizBlocked ? 'bg-red-500/15 text-red-400' : 'bg-brand-primary/15 text-brand-primary'}`}>
                <CheckSquare size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Quiz Pengetahuan Dasar Trading</h3>
                <p className="text-xs text-gray-400">Wajib diselesaikan. Hasil dibahas saat sesi 1-on-1 mentor.</p>
              </div>
            </div>
            {!userStatus.quizPassed && !isQuizBlocked && (
              <span className="text-xs font-bold text-gray-500 bg-brand-dark px-3 py-1.5 rounded-lg border border-white/10">
                {userStatus.quizAttempts}/{userStatus.maxAttempts}
              </span>
            )}
            {userStatus.quizPassed && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                <CheckCircle size={13} /> LULUS
              </span>
            )}
          </div>

          {!userStatus.quizPassed && (
            <>
              <div className="flex gap-2 mb-4">
                {Array.from({ length: userStatus.maxAttempts }, (_, i) => (
                  <div key={i} className={`flex-1 h-2 rounded-full ${i < userStatus.quizAttempts ? (isQuizBlocked ? 'bg-red-500' : 'bg-yellow-500') : 'bg-white/10'}`}></div>
                ))}
              </div>

              {userStatus.quizAttempts > 0 && (
                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Skor terakhir: </span>
                    <span className="font-black text-red-400 text-lg">{userStatus.quizScore}</span>
                    <span className="text-gray-500"> / 100</span>
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <div>
                    <span className="text-gray-500">Minimum: </span>
                    <span className="font-bold text-brand-primary">{userStatus.quizMinScore}</span>
                  </div>
                  {!isQuizBlocked && (
                    <>
                      <div className="w-px h-4 bg-white/10"></div>
                      <span className="text-yellow-400 font-bold text-xs">Sisa {userStatus.maxAttempts - userStatus.quizAttempts}x lagi</span>
                    </>
                  )}
                </div>
              )}

              {isQuizBlocked ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-400 mb-1">Gagal 3x — Semua Progres Di-Reset</p>
                    <p className="text-xs text-gray-400 mb-3">Batas percobaan habis. Semua progres materi dan tugas di-reset, kamu harus mulai dari awal.</p>
                    <button className="px-4 py-2 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors flex items-center gap-1.5">
                      <RotateCcw size={12} /> Reset & Mulai Ulang dari Awal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <p className="text-xs text-gray-500">
                    {userStatus.quizAttempts === 0
                      ? 'Kerjakan quiz ini untuk membuktikan pemahaman dasar trading kamu.'
                      : 'Skor belum mencapai minimum. Ulangi untuk meningkatkan pemahaman.'
                    }
                  </p>
                  <button onClick={() => navigate('/dashboard/homework')}
                    className="px-6 py-2.5 bg-brand-primary text-brand-dark font-bold text-sm rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.2)] shrink-0">
                    <Play size={15} /> {userStatus.quizAttempts > 0 ? 'Retake Quiz' : 'Mulai Quiz Sekarang'}
                  </button>
                </div>
              )}

              <div className="mt-4 bg-brand-dark/50 border border-white/5 rounded-xl p-3">
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  <span className="text-brand-primary font-bold">Aturan:</span> 10 soal • Min. skor 70 • Maks. 3 percobaan • Gagal 3x = reset dari awal • Hasil dibahas saat sesi 1-on-1 mentor.
                </p>
              </div>
            </>
          )}

          {userStatus.quizPassed && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <p className="text-3xl font-black text-green-400">{userStatus.quizScore}</p>
                  <p className="text-[10px] text-gray-500">SKOR</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <p className="text-sm text-gray-400">Lulus! Kamu sudah bisa mulai belajar dan booking mentor.</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/dashboard')}
                  className="px-5 py-2.5 bg-brand-primary text-brand-dark text-sm font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center gap-1.5">
                  <BookOpen size={14} /> Mulai Belajar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATUS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => navigate('/dashboard/homework')}
          className="bg-brand-secondary border border-white/10 rounded-xl p-4 text-left hover:border-brand-primary/30 transition-all group">
          <CheckSquare size={20} className="text-brand-primary mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-sm">Homework & Quiz</p>
          <p className="text-[11px] text-gray-500">Kerjakan tugas & quiz wajib</p>
        </button>
        <button onClick={() => navigate('/dashboard/booking')}
          className="bg-brand-secondary border border-white/10 rounded-xl p-4 text-left hover:border-brand-primary/30 transition-all group">
          <Calendar size={20} className="text-brand-primary mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-sm">Booking 1-on-1</p>
          <p className="text-[11px] text-gray-500">Jadwalkan sesi dengan mentor</p>
        </button>
        <button onClick={() => navigate('/dashboard/tickets')}
          className="bg-brand-secondary border border-white/10 rounded-xl p-4 text-left hover:border-brand-primary/30 transition-all group">
          <MessageSquare size={20} className="text-brand-primary mb-2 group-hover:scale-110 transition-transform" />
          <p className="font-bold text-sm">Private Ticketing</p>
          <p className="text-[11px] text-gray-500">Konsultasi privat dengan admin</p>
        </button>
      </div>
    </div>
  );
};

export default HowToStart;

import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, MessageSquare, Copy, AlertCircle, Check, User, Phone, Mail, Upload } from 'lucide-react';
import api from '../services/api';

const steps = ['Syarat & Ketentuan', 'Data Diri', 'Binding Discord', 'Konfirmasi'];

const StepIndicator = ({ current }) => (
  <div className="flex items-center justify-between mb-8 px-2">
    {steps.map((s, i) => (
      <React.Fragment key={i}>
        <div className="flex flex-col items-center gap-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all ${
            i < current ? 'bg-brand-primary border-brand-primary text-brand-dark' :
            i === current ? 'bg-transparent border-brand-primary text-brand-primary' :
            'bg-transparent border-white/20 text-gray-500'
          }`}>
            {i < current ? <Check size={14} /> : i + 1}
          </div>
          <span className={`text-[10px] font-bold text-center leading-tight max-w-[60px] ${i === current ? 'text-brand-primary' : 'text-gray-500'}`}>{s}</span>
        </div>
        {i < steps.length - 1 && (
          <div className={`flex-1 h-px mx-2 mb-4 ${i < current ? 'bg-brand-primary' : 'bg-white/10'}`}></div>
        )}
      </React.Fragment>
    ))}
  </div>
);

// Step 1: Syarat & Ketentuan
const StepTerms = ({ batch, onNext }) => {
  const [agreed, setAgreed] = useState(false);

  const terms = [
    'Pembayaran bersifat final dan tidak dapat dikembalikan (non-refundable).',
    'Akses materi hanya berlaku untuk satu akun dan tidak boleh dibagikan.',
    'Member wajib bergabung di server Discord resmi DuckStation.',
    'Pelanggaran aturan komunitas dapat mengakibatkan pencabutan akses tanpa pengembalian dana.',
    'Materi bersifat hak cipta dan dilarang keras untuk disebarluaskan.',
    'Admin berhak mencabut akses jika terbukti melakukan kecurangan pada quiz/homework.',
    'Sesi 1-on-1 harus dibooking minimal 24 jam sebelumnya.',
    'Pengguna bertanggung jawab penuh atas keputusan trading yang diambil.',
  ];

  return (
    <div>
      <h3 className="text-xl font-bold mb-1">Syarat & Ketentuan</h3>
      <p className="text-gray-400 text-sm mb-5">Baca dan pahami seluruh syarat sebelum melanjutkan pendaftaran <span className="text-brand-primary font-bold">{batch.name}</span>.</p>

      <div className="bg-brand-dark border border-white/10 rounded-2xl p-5 max-h-56 overflow-y-auto mb-5 space-y-3">
        {terms.map((t, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 rounded-full bg-brand-primary/20 text-brand-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            <p className="text-sm text-gray-300">{t}</p>
          </div>
        ))}
      </div>

      <label className="flex items-start gap-3 cursor-pointer group mb-6">
        <div onClick={() => setAgreed(!agreed)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? 'bg-brand-primary border-brand-primary' : 'border-white/30 group-hover:border-brand-primary/50'}`}>
          {agreed && <Check size={12} className="text-brand-dark" />}
        </div>
        <span className="text-sm text-gray-300">Saya telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan di atas.</span>
      </label>

      <button onClick={onNext} disabled={!agreed}
        className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all bg-brand-primary text-brand-dark hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed">
        Setuju & Lanjutkan <ChevronRight size={18} />
      </button>
    </div>
  );
};

// Step 2: Data Diri
const StepProfile = ({ onNext, onBack, form, setForm }) => {
  const isValid = form.fullName && form.email && form.telegram;

  return (
    <div>
      <h3 className="text-xl font-bold mb-1">Data Diri</h3>
      <p className="text-gray-400 text-sm mb-5">Isi data diri kamu dengan benar. Admin akan menghubungi via Telegram untuk konfirmasi pembayaran.</p>

      <div className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider"><User size={11}/> Nama Lengkap <span className="text-red-400">*</span></label>
          <input type="text" placeholder="Nama sesuai identitas" value={form.fullName}
            onChange={e => setForm({...form, fullName: e.target.value})}
            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/60 transition-colors" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider"><Mail size={11}/> Email <span className="text-red-400">*</span></label>
          <input type="email" placeholder="email@example.com" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/60 transition-colors" />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider"><Phone size={11}/> Username Telegram <span className="text-red-400">*</span></label>
          <div className="relative">
            <span className="absolute left-4 top-3.5 text-gray-500 text-sm">@</span>
            <input type="text" placeholder="username_kamu" value={form.telegram}
              onChange={e => setForm({...form, telegram: e.target.value})}
              className="w-full bg-brand-dark border border-white/10 rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand-primary/60 transition-colors" />
          </div>
          <p className="text-[10px] text-gray-500 mt-1.5">Admin akan menghubungi kamu di Telegram untuk konfirmasi dan pengiriman QRIS.</p>
        </div>
        <div>
          <label className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-1 uppercase tracking-wider">Pengalaman Trading</label>
          <select value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}
            className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-primary/60 transition-colors">
            <option value="">Pilih pengalaman...</option>
            <option>Pemula (belum pernah trading)</option>
            <option>Beginner (sudah coba tapi belum konsisten)</option>
            <option>Intermediate (sudah beberapa bulan)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl font-bold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
          <ChevronLeft size={16}/> Kembali
        </button>
        <button onClick={onNext} disabled={!isValid}
          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand-primary text-brand-dark hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          Lanjutkan <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Step 3: Binding Discord
const StepDiscord = ({ onNext, onBack }) => {
  const [discordLinked, setDiscordLinked] = useState(false);

  return (
    <div>
      <h3 className="text-xl font-bold mb-1">Binding Discord</h3>
      <p className="text-gray-400 text-sm mb-5">Hubungkan akun Discord kamu. Ini wajib agar Role eksklusif otomatis diberikan setelah pembayaran dikonfirmasi.</p>

      <div className="space-y-4 mb-6">
        <div className={`p-5 rounded-2xl border transition-all ${discordLinked ? 'bg-green-500/10 border-green-500/30' : 'bg-brand-dark border-white/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${discordLinked ? 'bg-green-500/20 text-green-400' : 'bg-[#5865F2]/20 text-[#5865F2]'}`}>
                <MessageSquare size={22} />
              </div>
              <div>
                <p className="font-bold">Discord Akun</p>
                <p className="text-xs text-gray-400">{discordLinked ? 'Terhubung' : 'Belum terhubung — Wajib diisi'}</p>
              </div>
            </div>
            {discordLinked
              ? <button onClick={() => setDiscordLinked(false)} className="text-xs text-red-400 font-bold hover:text-red-300 transition-colors">Unlink</button>
              : <button onClick={() => setDiscordLinked(true)}
                  className="px-5 py-2.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl text-sm transition-colors">
                  Authorize
                </button>
            }
          </div>
        </div>

        {!discordLinked && (
          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <AlertCircle size={15} className="text-yellow-400 shrink-0 mt-0.5"/>
            <p className="text-xs text-yellow-300">Discord wajib dihubungkan agar Role kelas dapat diberikan secara otomatis setelah admin melakukan approval.</p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl font-bold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
          <ChevronLeft size={16}/> Kembali
        </button>
        <button onClick={onNext} disabled={!discordLinked}
          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand-primary text-brand-dark hover:bg-yellow-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          Lanjut ke Konfirmasi <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Step 4: Konfirmasi
const StepConfirm = ({ batch, form, onBack, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.createOrder({
        batchId: batch._id,
        method: 'QRIS',
        telegram: form.telegram,
        fullName: form.fullName,
        email: form.email,
        discordTag: form.discordTag || '',
      });
      if (res.success) {
        setSubmitted(true);
      } else {
        setError(res.message || 'Gagal mengirim pendaftaran.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-4">
          <Check size={40} className="text-green-400" />
        </div>
        <h3 className="text-2xl font-black mb-2">Pendaftaran Diterima!</h3>
        <p className="text-gray-400 text-sm mb-4 max-w-xs">
          Admin akan menghubungi kamu via <span className="text-[#5865F2] font-bold">Telegram</span> dalam 1x24 jam untuk konfirmasi pembayaran.
        </p>
        <div className="bg-brand-dark border border-white/10 rounded-xl p-4 w-full mb-5 text-left">
          <p className="text-xs text-gray-500 mb-2">Ringkasan Pendaftaran</p>
          <p className="font-bold">{batch.name}</p>
          <p className="text-sm text-gray-400">Status: <span className="text-yellow-400 font-bold">Menunggu Konfirmasi Admin</span></p>
        </div>
        <button onClick={onClose} className="px-8 py-3 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors">
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-1">Ringkasan & Konfirmasi</h3>
      <p className="text-gray-400 text-sm mb-5">Pastikan data sudah benar sebelum mengirim pendaftaran.</p>

      {/* Summary */}
      <div className="bg-brand-dark border border-white/10 rounded-2xl p-5 mb-5">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Batch</span>
            <span className="font-bold">{batch.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Harga</span>
            <span className="font-bold text-brand-primary">{batch.priceIdr} / {batch.priceUsdt}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Discord Role</span>
            <span className="font-bold text-[#5865F2]">@{batch.discordRole}</span>
          </div>
          <div className="h-px bg-white/10"></div>
          <div className="flex items-start gap-2 bg-brand-secondary rounded-xl p-3">
            <AlertCircle size={15} className="text-brand-primary shrink-0 mt-0.5"/>
            <div className="text-xs text-gray-300">
              <p className="font-bold text-white mb-1">Cara Pembayaran:</p>
              <ol className="space-y-1 text-gray-400 list-decimal ml-4">
                <li>Klik "Kirim Pendaftaran" di bawah</li>
                <li>Admin menghubungi via Telegram dalam 1x24 jam</li>
                <li>Admin mengirimkan QRIS / nomor rekening</li>
                <li>Lakukan transfer & kirim bukti</li>
                <li>Admin approve → akses & Discord Role aktif</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-5 py-3 rounded-xl font-bold text-gray-400 border border-white/10 hover:bg-white/5 transition-colors flex items-center gap-2">
          <ChevronLeft size={16}/> Kembali
        </button>
        {error && <p className="text-red-400 text-xs font-bold absolute bottom-20 left-0 right-0 text-center">{error}</p>}
        <button onClick={handleSubmit} disabled={loading}
          className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand-primary text-brand-dark hover:bg-yellow-400 disabled:opacity-50 transition-all">
          {loading ? 'Mengirim...' : <><span>Kirim Pendaftaran</span> <ChevronRight size={18} /></>}
        </button>
      </div>
    </div>
  );
};

// ─── MAIN MODAL ───
const EnrollModal = ({ batch, onClose }) => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ fullName: '', email: '', telegram: '', experience: '' });

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => s - 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-brand-secondary border border-white/10 rounded-3xl w-full max-w-xl shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Mendaftar</p>
            <h2 className="text-xl font-black text-white">{batch.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <StepIndicator current={step} />

          {step === 0 && <StepTerms batch={batch} onNext={next} />}
          {step === 1 && <StepProfile onNext={next} onBack={back} form={form} setForm={setForm} />}
          {step === 2 && <StepDiscord onNext={next} onBack={back} />}
          {step === 3 && <StepConfirm batch={batch} form={form} onBack={back} onClose={onClose} />}
        </div>
      </div>
    </div>
  );
};

export default EnrollModal;
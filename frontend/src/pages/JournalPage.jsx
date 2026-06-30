import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit3, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Target, DollarSign, X, BarChart3, Camera, Eye, EyeOff, Check, Minus } from 'lucide-react';
import api from '../services/api';

const TIMEFRAMES = ['M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1'];
const MONTHS_ID = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const formatMoney = (n) => {
  if (n == null) return '$0';
  const sign = n >= 0 ? '+' : '';
  return `${sign}$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
};

const AccountModal = ({ onClose, onSave, editAccount }) => {
  const [name, setName] = useState(editAccount?.name || '');
  const [type, setType] = useState(editAccount?.type || 'personal');
  const [balance, setBalance] = useState(editAccount?.balance || 5000);
  const [broker, setBroker] = useState(editAccount?.broker || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (editAccount) {
      await api.updateAccount(editAccount._id, { name, type, balance: Number(balance), broker });
    } else {
      await api.createAccount({ name, type, balance: Number(balance), broker });
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">{editAccount ? 'Edit Akun' : 'Akun Baru'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nama Akun</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Contoh: Personal Account"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tipe</label>
              <select value={type} onChange={e => setType(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50">
                <option value="personal">Personal</option>
                <option value="funded">Funded</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Balance Awal ($)</label>
              <input type="number" value={balance} onChange={e => setBalance(e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Broker (opsional)</label>
            <input type="text" value={broker} onChange={e => setBroker(e.target.value)} placeholder="Contoh: FTMO"
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary/50 text-sm" />
          </div>
          <button type="submit"
            className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            {editAccount ? 'Simpan Perubahan' : 'Buat Akun'}
          </button>
        </form>
      </div>
    </div>
  );
};

const EntryModal = ({ onClose, onSave, editEntry, accountId }) => {
  const [form, setForm] = useState({
    date: editEntry?.date ? new Date(editEntry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    pair: editEntry?.pair || '',
    timeframe: editEntry?.timeframe || 'H1',
    direction: editEntry?.direction || 'buy',
    entryPrice: editEntry?.entryPrice || '',
    exitPrice: editEntry?.exitPrice || '',
    risk: editEntry?.risk || '',
    pnl: editEntry?.pnl || '',
    result: editEntry?.result || 'pending',
    reason: editEntry?.reason || '',
    notes: editEntry?.notes || '',
    images: editEntry?.images || [],
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleImage = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length + form.images.length > 3) return alert('Maksimal 3 gambar');
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => setForm(f => ({ ...f, images: [...f.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.pair.trim()) return alert('Pair wajib diisi');
    const data = { ...form, accountId, entryPrice: Number(form.entryPrice) || 0, exitPrice: Number(form.exitPrice) || 0, risk: Number(form.risk) || 0, pnl: Number(form.pnl) || 0 };
    if (editEntry) {
      await api.updateJournalEntry(editEntry._id, data);
    } else {
      await api.createJournalEntry(data);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">{editEntry ? 'Edit Trade' : 'Trade Baru'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tanggal</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Pair</label>
              <input type="text" value={form.pair} onChange={e => update('pair', e.target.value.toUpperCase())} placeholder="XAUUSD"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Timeframe</label>
              <select value={form.timeframe} onChange={e => update('timeframe', e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50">
                {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Direction</label>
              <div className="flex gap-2">
                <button type="button" onClick={() => update('direction', 'buy')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${form.direction === 'buy' ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-brand-dark border-white/10 text-gray-400 hover:text-white'}`}>
                  BUY
                </button>
                <button type="button" onClick={() => update('direction', 'sell')}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${form.direction === 'sell' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-brand-dark border-white/10 text-gray-400 hover:text-white'}`}>
                  SELL
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Entry Price</label>
              <input type="number" step="any" value={form.entryPrice} onChange={e => update('entryPrice', e.target.value)} placeholder="0.00"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Exit Price</label>
              <input type="number" step="any" value={form.exitPrice} onChange={e => update('exitPrice', e.target.value)} placeholder="0.00"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Risk ($)</label>
              <input type="number" step="any" value={form.risk} onChange={e => update('risk', e.target.value)} placeholder="0"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">PnL ($)</label>
              <input type="number" step="any" value={form.pnl} onChange={e => update('pnl', e.target.value)} placeholder="0"
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Result</label>
              <select value={form.result} onChange={e => update('result', e.target.value)}
                className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50">
                <option value="pending">Pending</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="breakeven">Breakeven</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Alasan Trade</label>
            <textarea value={form.reason} onChange={e => update('reason', e.target.value)} placeholder="Kenapa ambil posisi ini?" rows={2}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Catatan</label>
            <textarea value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Pelajaran, emosi, dll." rows={2}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-primary/50 resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Screenshot (maks 3)</label>
            <input type="file" accept="image/*" multiple onChange={handleImage}
              className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-brand-primary/20 file:text-brand-primary hover:file:bg-brand-primary/30" />
            {form.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt="" className="w-16 h-16 object-cover rounded-lg border border-white/10" />
                    <button type="button" onClick={() => update('images', form.images.filter((_, j) => j !== i))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit"
            className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            {editEntry ? 'Simpan Perubahan' : 'Tambah Trade'}
          </button>
        </form>
      </div>
    </div>
  );
};

const EquityChart = ({ data, startBalance }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
        <h3 className="font-bold text-sm mb-4 text-gray-300">Equity Curve</h3>
        <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Belum ada data</div>
      </div>
    );
  }
  const allEquity = data.map(d => d.equity);
  const min = Math.min(...allEquity, startBalance) * 0.98;
  const max = Math.max(...allEquity, startBalance) * 1.02;
  const range = max - min || 1;
  const w = 600;
  const h = 180;
  const padding = 10;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (w - padding * 2);
    const y = padding + ((max - d.equity) / range) * (h - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const lastEquity = data[data.length - 1].equity;
  const lineColor = lastEquity >= startBalance ? '#22c55e' : '#ef4444';

  return (
    <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
      <h3 className="font-bold text-sm mb-4 text-gray-300">Equity Curve</h3>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
        <line x1={padding} y1={padding} x2={padding} y2={h - padding} stroke="#ffffff10" strokeWidth="1" />
        <line x1={padding} y1={h - padding} x2={w - padding} y2={h - padding} stroke="#ffffff10" strokeWidth="1" />
        <line x1={padding} y1={padding + ((max - startBalance) / range) * (h - padding * 2)} x2={w - padding} y2={padding + ((max - startBalance) / range) * (h - padding * 2)} stroke="#ffffff15" strokeWidth="1" strokeDasharray="4 4" />
        <polyline fill="none" stroke={lineColor} strokeWidth="2" points={points} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={points.split(' ').pop()?.split(',')[0]} cy={points.split(' ').pop()?.split(',')[1]} r="4" fill={lineColor} />
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{new Date(data[0].date).toLocaleDateString('id-ID')}</span>
        <span>{new Date(data[data.length - 1].date).toLocaleDateString('id-ID')}</span>
      </div>
    </div>
  );
};

const CalendarPnL = ({ entries, onDayClick, currentMonth, onMonthChange }) => {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const pnlByDay = {};
  entries.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      pnlByDay[day] = (pnlByDay[day] || 0) + (e.pnl || 0);
    }
  });

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthPnl = Object.values(pnlByDay).reduce((s, v) => s + v, 0);

  return (
    <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => onMonthChange(new Date(year, month - 1))} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="text-center">
          <h3 className="font-bold text-sm">{MONTHS_ID[month]} {year}</h3>
          <p className={`text-xs font-bold mt-1 ${monthPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatMoney(monthPnl)} total</p>
        </div>
        <button onClick={() => onMonthChange(new Date(year, month + 1))} className="p-1 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {DAYS_ID.map(d => (
          <div key={d} className="text-center text-[10px] text-gray-500 font-bold py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const pnl = pnlByDay[day];
          const hasPnl = pnl != null;
          return (
            <button key={day} onClick={() => onDayClick(day)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors border ${
                hasPnl
                  ? pnl > 0 ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
                    : pnl < 0 ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                  : 'border-transparent text-gray-500 hover:bg-white/5'
              }`}>
              <span className="font-medium">{day}</span>
              {hasPnl && <span className="text-[9px] font-bold">{formatMoney(pnl)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const JournalPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [editAccount, setEditAccount] = useState(null);
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayEntries, setDayEntries] = useState(null);
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadAccounts = useCallback(async () => {
    try {
      const res = await api.getAccounts();
      if (res.success) {
        setAccounts(res.accounts);
        if (res.accounts.length > 0 && !selectedAccount) {
          setSelectedAccount(res.accounts[0]._id);
        }
      }
    } catch (e) { console.error(e); }
  }, []);

  const loadEntries = useCallback(async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      const [journalRes, statsRes] = await Promise.all([
        api.getJournal({ accountId: selectedAccount }),
        api.getJournalStats(selectedAccount),
      ]);
      if (journalRes.success) setEntries(journalRes.entries);
      if (statsRes.success) setStats(statsRes.stats);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, [selectedAccount]);

  useEffect(() => { loadAccounts(); }, []);
  useEffect(() => { if (selectedAccount) loadEntries(); }, [selectedAccount]);

  const handleAccountSave = () => { setShowAccountModal(false); setEditAccount(null); loadAccounts(); };

  const handleEntrySave = () => { setShowEntryModal(false); setEditEntry(null); setDayEntries(null); loadEntries(); };

  const handleDelete = async (id) => {
    await api.deleteJournalEntry(id);
    setDeleteConfirm(null);
    setDayEntries(null);
    loadEntries();
  };

  const handleDayClick = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const filtered = entries.filter(e => {
      const ed = new Date(e.date);
      return ed.getFullYear() === d.getFullYear() && ed.getMonth() === d.getMonth() && ed.getDate() === d.getDate();
    });
    setDayEntries({ day, entries: filtered });
  };

  const selectedAcc = accounts.find(a => a._id === selectedAccount);

  const monthEntries = entries.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth.getMonth() && d.getFullYear() === currentMonth.getFullYear();
  });

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black">Trading Journal</h2>
          <p className="text-gray-400 text-sm mt-1">Catat dan analisis setiap trade Anda.</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedAccount || ''} onChange={e => { setSelectedAccount(e.target.value); setDayEntries(null); }}
            className="bg-brand-secondary border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-primary/50">
            {accounts.length === 0 && <option value="">Buat akun dulu</option>}
            {accounts.map(a => (
              <option key={a._id} value={a._id}>{a.name} — ${a.currentBalance?.toLocaleString()}</option>
            ))}
          </select>
          <button onClick={() => { setEditAccount(null); setShowAccountModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors whitespace-nowrap">
            <Plus size={16} /> <span className="hidden sm:inline">Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Account Info */}
      {selectedAcc && (
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{selectedAcc.type}</span>
          {selectedAcc.broker && <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{selectedAcc.broker}</span>}
          <button onClick={() => { setEditAccount(selectedAcc); setShowAccountModal(true); }}
            className="text-xs text-gray-400 hover:text-brand-primary transition-colors underline">Edit Akun</button>
          <button onClick={() => { if (confirm('Hapus akun ini beserta semua trade?')) { api.deleteAccount(selectedAcc._id).then(() => { setSelectedAccount(null); setDayEntries(null); loadAccounts(); }); } }}
            className="text-xs text-red-400 hover:text-red-300 transition-colors underline">Hapus Akun</button>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${stats.totalPnl >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stats.totalPnl >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
              </div>
              <span className="text-xs text-gray-400">Total PnL</span>
            </div>
            <p className={`text-xl font-black ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatMoney(stats.totalPnl)}</p>
          </div>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400"><Target size={18} /></div>
              <span className="text-xs text-gray-400">Win Rate</span>
            </div>
            <p className="text-xl font-black">{stats.winRate}%</p>
          </div>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400"><BarChart3 size={18} /></div>
              <span className="text-xs text-gray-400">Total Trades</span>
            </div>
            <p className="text-xl font-black">{stats.totalTrades}</p>
            <p className="text-[10px] text-gray-500 mt-1">{stats.wins}W / {stats.losses}L</p>
          </div>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400"><DollarSign size={18} /></div>
              <span className="text-xs text-gray-400">Balance</span>
            </div>
            <p className="text-xl font-black">${selectedAcc?.currentBalance?.toLocaleString() || '0'}</p>
          </div>
        </div>
      )}

      {/* Equity Curve & Calendar Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <EquityChart data={stats?.equityCurve} startBalance={stats?.startBalance || 5000} />
        <CalendarPnL entries={entries} onDayClick={handleDayClick} currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
      </div>

      {/* Day Detail Modal */}
      {dayEntries && (
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">Trade {dayEntries.day} {MONTHS_ID[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
            <button onClick={() => setDayEntries(null)} className="text-gray-400 hover:text-white"><X size={16} /></button>
          </div>
          {dayEntries.entries.length === 0 ? (
            <p className="text-gray-500 text-sm">Tidak ada trade di hari ini.</p>
          ) : (
            <div className="space-y-2">
              {dayEntries.entries.map(e => (
                <div key={e._id} className="flex items-center gap-3 p-3 bg-brand-dark rounded-xl border border-white/5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${e.direction === 'buy' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="font-bold text-sm">{e.pair}</span>
                  <span className="text-xs text-gray-400">{e.timeframe}</span>
                  <span className={`text-xs font-bold uppercase ${e.direction === 'buy' ? 'text-green-400' : 'text-red-400'}`}>{e.direction}</span>
                  <span className={`text-xs font-bold ml-auto ${e.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatMoney(e.pnl)}</span>
                  <button onClick={() => { setEditEntry(e); setShowEntryModal(true); setDayEntries(null); }}
                    className="text-gray-400 hover:text-brand-primary"><Edit3 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Entry Button */}
      {selectedAccount && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-gray-300">Semua Trade ({entries.length})</h3>
          <button onClick={() => { setEditEntry(null); setShowEntryModal(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-primary text-brand-dark font-bold rounded-xl text-sm hover:bg-yellow-400 transition-colors">
            <Plus size={16} /> Trade Baru
          </button>
        </div>
      )}

      {/* Entries Table */}
      <div className="bg-brand-secondary border border-white/10 rounded-2xl overflow-hidden">
        {!selectedAccount ? (
          <div className="p-8 text-center text-gray-500">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Buat akun trading terlebih dahulu untuk mulai journal.</p>
          </div>
        ) : loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Memuat...</div>
        ) : entries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <BarChart3 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Belum ada trade. Klik "Trade Baru" untuk mencatat trade pertama.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 text-xs">
                  <th className="text-left px-4 py-3 font-medium">Tanggal</th>
                  <th className="text-left px-4 py-3 font-medium">Pair</th>
                  <th className="text-left px-4 py-3 font-medium">TF</th>
                  <th className="text-left px-4 py-3 font-medium">Dir</th>
                  <th className="text-right px-4 py-3 font-medium">Risk</th>
                  <th className="text-right px-4 py-3 font-medium">PnL</th>
                  <th className="text-center px-4 py-3 font-medium">Result</th>
                  <th className="text-center px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {entries.map(e => (
                  <React.Fragment key={e._id}>
                    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                      onClick={() => setExpandedEntry(expandedEntry === e._id ? null : e._id)}>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{new Date(e.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })}</td>
                      <td className="px-4 py-3 font-bold">{e.pair}</td>
                      <td className="px-4 py-3 text-gray-400">{e.timeframe}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${e.direction === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {e.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-400">${e.risk || 0}</td>
                      <td className={`px-4 py-3 text-right font-bold ${e.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{formatMoney(e.pnl)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-xs font-bold uppercase ${
                          e.result === 'win' ? 'text-green-400' : e.result === 'loss' ? 'text-red-400' : e.result === 'breakeven' ? 'text-yellow-400' : 'text-gray-500'
                        }`}>{e.result}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1" onClick={ev => ev.stopPropagation()}>
                          <button onClick={() => { setEditEntry(e); setShowEntryModal(true); }}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-brand-primary transition-colors"><Edit3 size={14} /></button>
                          <button onClick={() => setDeleteConfirm(e._id)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                    {expandedEntry === e._id && (
                      <tr className="bg-brand-dark/50">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Entry Price</span>
                              <p className="text-gray-300">{e.entryPrice || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Exit Price</span>
                              <p className="text-gray-300">{e.exitPrice || '-'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Result</span>
                              <p className="text-gray-300 capitalize">{e.result}</p>
                            </div>
                            {e.reason && (
                              <div className="sm:col-span-3">
                                <span className="text-gray-500 text-xs">Alasan</span>
                                <p className="text-gray-300">{e.reason}</p>
                              </div>
                            )}
                            {e.notes && (
                              <div className="sm:col-span-3">
                                <span className="text-gray-500 text-xs">Catatan</span>
                                <p className="text-gray-300">{e.notes}</p>
                              </div>
                            )}
                            {e.images && e.images.length > 0 && (
                              <div className="sm:col-span-3">
                                <span className="text-gray-500 text-xs">Screenshots</span>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                  {e.images.map((img, i) => (
                                    <a key={i} href={img} target="_blank" rel="noopener noreferrer">
                                      <img src={img} alt="" className="w-20 h-20 object-cover rounded-lg border border-white/10 hover:border-brand-primary/50 transition-colors" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAccountModal && <AccountModal onClose={() => { setShowAccountModal(false); setEditAccount(null); }} onSave={handleAccountSave} editAccount={editAccount} />}
      {showEntryModal && <EntryModal onClose={() => { setShowEntryModal(false); setEditEntry(null); }} onSave={handleEntrySave} editEntry={editEntry} accountId={selectedAccount} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center" onClick={e => e.stopPropagation()}>
            <Trash2 size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="font-bold mb-2">Hapus Trade?</h3>
            <p className="text-gray-400 text-sm mb-4">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:bg-white/10 transition-colors">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500/20 border border-red-500/30 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/30 transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;

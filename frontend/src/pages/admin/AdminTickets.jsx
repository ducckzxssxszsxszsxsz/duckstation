import React, { useState } from 'react';
import { Search, Send, User, Circle, Clock, CheckCircle } from 'lucide-react';

const tickets = [
  { id: 1, user: 'Ahmad Rizky',   subject: 'Pertanyaan SMC Order Block',  status: 'open',    unread: 2, lastMsg: '2 jam lalu',
    messages: [
      { sender: 'user',  text: 'Halo Admin, saya masih bingung tentang Order Block di Modul 2.', time: '10:30' },
      { sender: 'admin', text: 'Halo! Order Block adalah area institusional. Cek chart GBPUSD H4 kemarin.', time: '10:45' },
      { sender: 'user',  text: 'Oh saya lihat, apakah itu di area 1.2850?', time: '11:00' },
      { sender: 'admin', text: 'Betul! Saya share video tambahan di Discord ya.', time: '11:15' },
    ]
  },
  { id: 2, user: 'Siti Nur',      subject: 'Request Retake Quiz S&R',      status: 'open',    unread: 1, lastMsg: '1 hari lalu',
    messages: [
      { sender: 'user',  text: 'Saya sudah 2x gagal quiz S&R, mohon bantuannya Admin.', time: 'Kemarin 14:20' },
    ]
  },
  { id: 3, user: 'Budi Santoso',  subject: 'Konfirmasi Pembayaran QRIS',   status: 'pending', unread: 0, lastMsg: '2 hari lalu',
    messages: [
      { sender: 'user',  text: 'Saya sudah transfer, ini bukti pembayarannya Admin.', time: '2 hari lalu 09:10' },
    ]
  },
  { id: 4, user: 'Dewi Putri',    subject: 'Review Trading Plan',          status: 'closed',  unread: 0, lastMsg: '3 hari lalu',
    messages: [
      { sender: 'user',  text: 'Admin, boleh tolong cek trading plan saya?', time: '3 hari lalu' },
      { sender: 'admin', text: 'Bagus! Entry point sudah sesuai SMC. Pertahankan!', time: '3 hari lalu' },
    ]
  },
];

const statusBadge = (s) => {
  if (s === 'open')    return <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold"><Circle size={7} fill="currentColor"/>Aktif</span>;
  if (s === 'pending') return <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] font-bold"><Clock size={8}/>Menunggu</span>;
  return <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-[10px] font-bold"><CheckCircle size={8}/>Selesai</span>;
};

const AdminTickets = () => {
  const [selected, setSelected] = useState(1);
  const [reply, setReply] = useState('');
  const current = tickets.find(t => t.id === selected);

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Ticket List */}
      <div className="w-80 border-r border-white/10 bg-[#0d0d12] flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <h3 className="font-bold text-lg mb-3">Ticketing Inbox</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-500" />
            <input type="text" placeholder="Cari tiket..." className="w-full bg-brand-dark border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50"/>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {tickets.map(t => (
            <button key={t.id} onClick={() => setSelected(t.id)}
              className={`w-full p-4 border-b border-white/5 text-left hover:bg-white/5 transition-colors ${selected === t.id ? 'bg-brand-primary/10 border-l-2 border-l-brand-primary' : ''}`}>
              <div className="flex justify-between items-start gap-2 mb-1">
                <p className="font-bold text-sm text-white">{t.user}</p>
                {t.unread > 0 && <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shrink-0">{t.unread}</span>}
              </div>
              <p className="text-xs text-gray-400 truncate mb-1.5">{t.subject}</p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-600">{t.lastMsg}</span>
                {statusBadge(t.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-grow flex flex-col bg-brand-dark">
        {current && (
          <>
            <div className="p-4 border-b border-white/10 bg-brand-secondary/50 flex items-center justify-between">
              <div>
                <p className="font-bold">{current.subject}</p>
                <p className="text-xs text-gray-400">User: {current.user}</p>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(current.status)}
                {current.status !== 'closed' && (
                  <button className="text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 px-3 py-1 rounded-lg font-bold border border-gray-500/20 transition-colors">Tutup Tiket</button>
                )}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {current.messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${m.sender === 'admin' ? 'bg-brand-primary text-brand-dark rounded-br-md' : 'bg-brand-secondary border border-white/10 text-white rounded-bl-md'}`}>
                    {m.sender === 'user' && (
                      <div className="flex items-center gap-1 mb-1">
                        <User size={10} className="text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-400">{current.user}</span>
                      </div>
                    )}
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.sender === 'admin' ? 'text-brand-dark/50' : 'text-gray-500'}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-brand-secondary/30">
              <div className="flex gap-3">
                <input type="text" value={reply} onChange={e => setReply(e.target.value)}
                  placeholder={current.status === 'closed' ? 'Tiket sudah ditutup...' : 'Ketik balasan sebagai Admin...'}
                  disabled={current.status === 'closed'}
                  className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 disabled:opacity-40 disabled:cursor-not-allowed" />
                <button disabled={current.status === 'closed'}
                  className="p-3 bg-brand-primary text-brand-dark rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;

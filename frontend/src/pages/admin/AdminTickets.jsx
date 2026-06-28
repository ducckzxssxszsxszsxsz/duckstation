import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, User, Circle, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';

const statusBadge = (s) => {
  if (s === 'open')    return <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold"><Circle size={7} fill="currentColor"/>Aktif</span>;
  if (s === 'pending') return <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] font-bold"><Clock size={8}/>Menunggu</span>;
  return <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-[10px] font-bold"><CheckCircle size={8}/>Selesai</span>;
};

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showList, setShowList] = useState(true);
  const chatRef = useRef(null);

  const fetchTickets = async () => {
    try {
      const res = await api.getAdminTickets();
      if (res.success) {
        setTickets(res.tickets || []);
        if (!selected && res.tickets?.length > 0) {
          setSelected(res.tickets[0]._id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const current = tickets.find(t => t._id === selected);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [current?.messages]);

  const handleSend = async () => {
    if (!reply.trim() || !current || current.status === 'closed' || sending) return;
    setSending(true);
    try {
      const res = await api.replyTicket(current._id, reply.trim());
      if (res.success) {
        setReply('');
        await fetchTickets();
      }
    } catch (err) {
      console.error('Failed to send reply:', err);
    } finally {
      setSending(false);
    }
  };

  const handleClose = async (id) => {
    try {
      const res = await api.closeTicket(id);
      if (res.success) await fetchTickets();
    } catch (err) {
      console.error('Failed to close ticket:', err);
    }
  };

  const selectTicket = (id) => {
    setSelected(id);
    setShowList(false);
  };

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Ticket List - hidden on mobile when chat is open */}
      <div className={`${showList ? 'flex' : 'hidden'} md:flex w-full md:w-80 border-r border-white/10 bg-[#0d0d12] flex-col shrink-0`}>
        <div className="p-4 border-b border-white/10">
          <h3 className="font-bold text-lg mb-3">Ticketing Inbox</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-3 text-gray-500" />
            <input type="text" placeholder="Cari tiket..." className="w-full bg-brand-dark border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50"/>
          </div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500 text-sm">Memuat...</div>
          ) : tickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">Tidak ada tiket.</div>
          ) : (
            tickets.map(t => (
              <button key={t._id} onClick={() => selectTicket(t._id)}
                className={`w-full p-4 border-b border-white/5 text-left hover:bg-white/5 transition-colors ${selected === t._id ? 'bg-brand-primary/10 border-l-2 border-l-brand-primary' : ''}`}>
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="font-bold text-sm text-white">{t.user?.name || 'User'}</p>
                  {t.status === 'open' && <span className="w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center shrink-0">!</span>}
                </div>
                <p className="text-xs text-gray-400 truncate mb-1.5">{t.subject}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString('id-ID') : ''}</span>
                  {statusBadge(t.status)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Panel */}
      <div className={`${!showList || typeof window !== 'undefined' && window.innerWidth >= 768 ? 'flex' : 'hidden'} md:flex flex-col flex-grow bg-brand-dark`}>
        {current ? (
          <>
            <div className="p-4 border-b border-white/10 bg-brand-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowList(true)} className="md:hidden p-1 text-gray-400 hover:text-white">
                  ←
                </button>
                <div>
                  <p className="font-bold">{current.subject}</p>
                  <p className="text-xs text-gray-400">User: {current.user?.name || 'Unknown'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {statusBadge(current.status)}
                {current.status !== 'closed' && (
                  <button onClick={() => handleClose(current._id)} className="text-xs bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 px-3 py-1 rounded-lg font-bold border border-gray-500/20 transition-colors">Tutup Tiket</button>
                )}
              </div>
            </div>

            <div ref={chatRef} className="flex-grow overflow-y-auto p-5 space-y-4">
              {(!current.messages || current.messages.length === 0) ? (
                <p className="text-sm text-gray-500 text-center py-10">Belum ada pesan.</p>
              ) : (
                current.messages.map((m, i) => (
                  <div key={i} className={`flex ${(m.sender === 'admin' || m.sender === 'Admin') ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${(m.sender === 'admin' || m.sender === 'Admin') ? 'bg-brand-primary text-brand-dark rounded-br-md' : 'bg-brand-secondary border border-white/10 text-white rounded-bl-md'}`}>
                      {(m.sender === 'user' || m.sender === 'User') && (
                        <div className="flex items-center gap-1 mb-1">
                          <User size={10} className="text-gray-400" />
                          <span className="text-[10px] font-bold text-gray-400">{current.user?.name || 'User'}</span>
                        </div>
                      )}
                      <p className="text-sm">{m.text}</p>
                      <p className={`text-[10px] mt-1 ${(m.sender === 'admin' || m.sender === 'Admin') ? 'text-brand-dark/50' : 'text-gray-500'}`}>
                        {m.time ? new Date(m.time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-brand-secondary/30">
              <div className="flex gap-3">
                <input type="text" value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={current.status === 'closed' ? 'Tiket sudah ditutup...' : 'Ketik balasan sebagai Admin...'}
                  disabled={current.status === 'closed'}
                  className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 disabled:opacity-40 disabled:cursor-not-allowed" />
                <button onClick={handleSend} disabled={current.status === 'closed' || sending}
                  className="p-3 bg-brand-primary text-brand-dark rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
            Pilih tiket untuk mulai membalas.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTickets;

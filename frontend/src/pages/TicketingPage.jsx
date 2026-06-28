import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Plus, Clock, CheckCircle, Circle, User, ArrowLeft, X } from 'lucide-react';
import api from '../services/api';

const TicketingPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [sending, setSending] = useState(false);
  const [replying, setReplying] = useState(false);

  const fetchTickets = () => {
    api.getMyTickets().then(res => {
      if (res.success) setTickets(res.tickets || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchTickets(); }, []);

  const getStatusBadge = (status) => {
    if (status === 'open') return <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold"><Circle size={8} fill="currentColor" /> Aktif</span>;
    if (status === 'pending') return <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] font-bold"><Clock size={8} /> Menunggu</span>;
    return <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-[10px] font-bold"><CheckCircle size={8} /> Selesai</span>;
  };

  const formatTime = (t) => {
    if (!t) return '';
    const d = new Date(t);
    const now = new Date();
    const diffH = Math.floor((now - d) / 3600000);
    if (diffH < 1) return 'Baru saja';
    if (diffH < 24) return `${diffH} jam yang lalu`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD} hari yang lalu`;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  const currentTicket = tickets.find(t => t._id === selectedTicket);

  const handleSelectTicket = (id) => {
    setSelectedTicket(id);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  const handleCreateTicket = async () => {
    if (!newSubject.trim() || !newBody.trim()) return;
    setSending(true);
    try {
      const res = await api.createTicket(newSubject.trim(), newBody.trim());
      if (res.success) {
        setShowNewTicket(false);
        setNewSubject('');
        setNewBody('');
        fetchTickets();
      }
    } catch {} finally { setSending(false); }
  };

  const handleReply = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setReplying(true);
    try {
      const res = await api.replyTicket(selectedTicket, newMessage.trim());
      if (res.success) {
        setNewMessage('');
        fetchTickets();
      }
    } catch {} finally { setReplying(false); }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showNewTicket) handleCreateTicket();
      else handleReply();
    }
  };

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* New Ticket Modal (mobile-friendly inline) */}
      {showNewTicket && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
          <div className="bg-brand-secondary border border-white/10 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Tiket Baru</h3>
              <button onClick={() => setShowNewTicket(false)} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} /></button>
            </div>
            <input
              type="text"
              placeholder="Subjek"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 mb-3"
            />
            <textarea
              placeholder="Tuliskan pesan Anda..."
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
              rows={4}
              className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50 mb-4 resize-none"
            />
            <button
              onClick={handleCreateTicket}
              disabled={sending || !newSubject.trim() || !newBody.trim()}
              className="w-full py-3 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div> : <Send size={16} />}
              Kirim
            </button>
          </div>
        </div>
      )}

      {/* Ticket List */}
      <div className={`w-full md:w-80 border-r border-white/10 bg-brand-secondary/30 flex flex-col shrink-0 ${
        mobileView === 'chat' && !selectedTicket ? 'hidden' : ''
      } ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Tiket Konsultasi</h3>
            <button
              onClick={() => setShowNewTicket(true)}
              className="p-2 bg-brand-primary text-brand-dark rounded-lg hover:bg-yellow-400 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada tiket</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <button
                key={ticket._id}
                onClick={() => handleSelectTicket(ticket._id)}
                className={`w-full p-4 border-b border-white/5 text-left transition-colors hover:bg-white/5 ${
                  selectedTicket === ticket._id ? 'bg-brand-primary/10 border-l-2 border-l-brand-primary' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-sm truncate flex-1">{ticket.subject}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{formatTime(ticket.updatedAt)}</span>
                  {getStatusBadge(ticket.status)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-grow flex flex-col bg-brand-dark ${
        mobileView === 'list' && !currentTicket ? 'hidden' : ''
      } ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {currentTicket ? (
          <>
            <div className="p-4 border-b border-white/10 bg-brand-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToList} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 md:hidden">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{currentTicket.subject}</h4>
                  <p className="text-xs text-gray-400">{currentTicket.status === 'open' ? 'Menunggu admin' : currentTicket.status === 'pending' ? 'Dalam antrian' : 'Selesai'}</p>
                </div>
              </div>
              {getStatusBadge(currentTicket.status)}
            </div>

            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {(currentTicket.messages || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] sm:max-w-[70%] ${
                    msg.sender === 'user'
                      ? 'bg-brand-primary text-brand-dark rounded-2xl rounded-br-md'
                      : 'bg-brand-secondary border border-white/10 text-white rounded-2xl rounded-bl-md'
                  } px-4 py-3`}>
                    {msg.sender === 'admin' && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <User size={10} className="text-brand-primary" />
                        </div>
                        <span className="text-[10px] font-bold text-brand-primary">Admin</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-brand-dark/50' : 'text-gray-500'}`}>{formatTime(msg.time)}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentTicket.status !== 'closed' && (
              <div className="p-3 sm:p-4 border-t border-white/10 bg-brand-secondary/30">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ketik pesan Anda..."
                    className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50"
                  />
                  <button
                    onClick={handleReply}
                    disabled={replying || !newMessage.trim()}
                    className="p-3 bg-brand-primary text-brand-dark rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)] shrink-0 disabled:opacity-50"
                  >
                    {replying ? <div className="w-[18px] h-[18px] border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div> : <Send size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 px-1 hidden sm:block">Pesan ini hanya dilihat oleh Anda dan admin. Bersifat privat dan end-to-end encrypted.</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-400">
            <MessageSquare size={48} className="mb-4 opacity-50" />
            <p className="text-lg">Pilih tiket untuk melihat percakapan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketingPage;

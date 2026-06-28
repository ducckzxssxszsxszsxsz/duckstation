import React, { useState } from 'react';
import { MessageSquare, Send, Plus, Clock, CheckCircle, Circle, User, ArrowLeft } from 'lucide-react';

const TicketingPage = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [mobileView, setMobileView] = useState('list');

  const tickets = [
    {
      id: 1,
      subject: 'Pertanyaan tentang SMC Order Block',
      status: 'open',
      lastMessage: '2 jam yang lalu',
      unread: 2,
      admin: 'Admin Raka',
      messages: [
        { id: 1, sender: 'user', text: 'Halo Admin, saya masih bingung tentang konsep Order Block di Modul 2. Bisa dijelaskan lebih detail?', time: '10:30' },
        { id: 2, sender: 'admin', text: 'Halo! Tentu, Order Block adalah area di mana institutional order ditempatkan. Coba perhatikan chart GBPUSD H4 kemarin, ada OB yang masih fresh.', time: '10:45' },
        { id: 3, sender: 'user', text: 'Oh saya lihat, apakah itu yang di area 1.2850?', time: '11:00' },
        { id: 4, sender: 'admin', text: 'Betul sekali! Itu contoh OB yang bagus. Untuk lebih jelasnya, saya akan share video tutorial tambahan di Discord.', time: '11:15' },
      ]
    },
    {
      id: 2,
      subject: 'Request Retake Quiz S&R',
      status: 'pending',
      lastMessage: '1 hari yang lalu',
      unread: 0,
      admin: null,
      messages: [
        { id: 1, sender: 'user', text: 'Saya sudah mengulang quiz S&R sebanyak 2 kali tapi masih gagal. Apakah bisa dibantu?', time: 'Kemarin, 14:20' },
      ]
    },
    {
      id: 3,
      subject: 'Konsultasi Setup Trading Plan',
      status: 'closed',
      lastMessage: '3 hari yang lalu',
      unread: 0,
      admin: 'Admin Raka',
      messages: [
        { id: 1, sender: 'user', text: 'Admin, boleh tolong review trading plan saya?', time: '3 hari lalu, 09:00' },
        { id: 2, sender: 'admin', text: 'Tentu, silakan kirim screenshot entry plan Anda.', time: '3 hari lalu, 09:15' },
        { id: 3, sender: 'user', text: '[Screenshot Trading Plan]', time: '3 hari lalu, 09:20' },
        { id: 4, sender: 'admin', text: 'Secara keseluruhan bagus. Entry point sudah sesuai SMC. Risk management juga oke. Tetap pertahankan!', time: '3 hari lalu, 10:00' },
      ]
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'open') return <span className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-[10px] font-bold"><Circle size={8} fill="currentColor" /> Aktif</span>;
    if (status === 'pending') return <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full text-[10px] font-bold"><Clock size={8} /> Menunggu</span>;
    return <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-500/20 text-gray-400 rounded-full text-[10px] font-bold"><CheckCircle size={8} /> Selesai</span>;
  };

  const currentTicket = tickets.find(t => t.id === selectedTicket);

  const handleSelectTicket = (id) => {
    setSelectedTicket(id);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setMobileView('list');
  };

  return (
    <div className="flex h-[calc(100vh-73px)] overflow-hidden">
      {/* Ticket List */}
      <div className={`w-full md:w-80 border-r border-white/10 bg-brand-secondary/30 flex flex-col shrink-0 ${
        mobileView === 'chat' && !selectedTicket ? 'hidden' : ''
      } ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Tiket Konsultasi</h3>
            <button className="p-2 bg-brand-primary text-brand-dark rounded-lg hover:bg-yellow-400 transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <input 
            type="text" 
            placeholder="Cari tiket..." 
            className="w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50"
          />
        </div>
        
        <div className="flex-grow overflow-y-auto">
          {tickets.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => handleSelectTicket(ticket.id)}
              className={`w-full p-4 border-b border-white/5 text-left transition-colors hover:bg-white/5 ${
                selectedTicket === ticket.id ? 'bg-brand-primary/10 border-l-2 border-l-brand-primary' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="font-bold text-sm truncate flex-1">{ticket.subject}</span>
                {ticket.unread > 0 && (
                  <span className="w-5 h-5 bg-brand-primary text-brand-dark rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                    {ticket.unread}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{ticket.lastMessage}</span>
                {getStatusBadge(ticket.status)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-grow flex flex-col bg-brand-dark ${
        mobileView === 'list' && !currentTicket ? 'hidden' : ''
      } ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
        {currentTicket ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-brand-secondary/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={handleBackToList} className="p-1 rounded-lg hover:bg-white/10 text-gray-400 md:hidden">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h4 className="font-bold text-sm sm:text-base">{currentTicket.subject}</h4>
                  <p className="text-xs text-gray-400">
                    {currentTicket.admin ? `Ditangani oleh ${currentTicket.admin}` : 'Menunggu admin tersedia'}
                  </p>
                </div>
              </div>
              {getStatusBadge(currentTicket.status)}
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {currentTicket.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                        <span className="text-[10px] font-bold text-brand-primary">{currentTicket.admin}</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-brand-dark/50' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-white/10 bg-brand-secondary/30">
              <div className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pesan Anda..."
                  className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/50"
                />
                <button className="p-3 bg-brand-primary text-brand-dark rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.2)] shrink-0">
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 px-1 hidden sm:block">Pesan ini hanya dilihat oleh Anda dan admin. Bersifat privat dan end-to-end encrypted.</p>
            </div>
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

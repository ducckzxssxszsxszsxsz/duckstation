import React, { useState, useEffect } from 'react';
import { Mail, Trash2, ChevronDown, ChevronUp, Inbox, Clock } from 'lucide-react';
import api from '../services/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    try {
      const res = await api.getMessages();
      if (res.success) setMessages(res.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleExpand = async (msg) => {
    if (expandedId === msg._id) {
      setExpandedId(null);
    } else {
      setExpandedId(msg._id);
      if (!msg.read) {
        try {
          await api.markMessageRead(msg._id);
          setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, read: true } : m));
        } catch (err) {
          console.error('Failed to mark as read:', err);
        }
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await api.deleteMessage(id);
      setMessages(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 sm:p-12 text-center text-gray-400">Memuat pesan...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-1">Pesan Admin</h2>
        <p className="text-gray-400 text-sm sm:text-base">Pesan dari admin untuk Anda.</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 sm:p-12 text-center text-gray-400">
          <Inbox size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Belum ada pesan</p>
          <p className="text-sm mt-1">Pesan dari admin akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div
              key={msg._id}
              onClick={() => handleExpand(msg)}
              className={`bg-brand-secondary border rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:border-brand-primary/30 ${
                msg.read ? 'border-white/10' : 'border-brand-primary/40 bg-brand-primary/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl shrink-0 ${msg.read ? 'bg-gray-700' : 'bg-brand-primary/10'}`}>
                    <Mail size={18} className={msg.read ? 'text-gray-500' : 'text-brand-primary'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!msg.read && <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0"></span>}
                      <h4 className={`font-bold text-sm sm:text-base truncate ${msg.read ? 'text-gray-300' : 'text-white'}`}>{msg.subject}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Dari: {msg.from?.name || 'Admin'}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {formatDate(msg.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => handleDelete(e, msg._id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expandedId === msg._id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                </div>
              </div>
              {expandedId === msg._id && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesPage;

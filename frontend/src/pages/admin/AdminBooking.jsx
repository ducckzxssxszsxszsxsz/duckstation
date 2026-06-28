import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Ban, RefreshCw, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

const ALL_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '19:00', '20:00'];

const dates = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() + i);
  return { id: i, dateStr: d.toISOString().split('T')[0], dayName: d.toLocaleDateString('id-ID',{weekday:'short'}), dayNum: d.getDate(), month: d.toLocaleDateString('id-ID',{month:'short'}), isWeekend: d.getDay()===0||d.getDay()===6 };
});

const initialBookings = [
  { id: 1, user: 'Ahmad Rizky',  time: '10:00', status: 'confirmed', date: 0 },
  { id: 2, user: 'Siti Nur',     time: '13:00', status: 'pending',   date: 0 },
  { id: 3, user: 'Dewi Putri',   time: '10:00', status: 'confirmed', date: 2 },
  { id: 4, user: 'Reza Pratama', time: '15:00', status: 'pending',   date: 3 },
];

const AdminBooking = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [bookings, setBookings] = useState(initialBookings);
  const [showSettings, setShowSettings] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(() => {
    const init = {};
    dates.forEach(d => { init[d.id] = [...ALL_SLOTS]; });
    return init;
  });

  const dayBookings = bookings.filter(b => b.date === selectedDate);

  const toggleSlot = (time) => {
    setAvailableSlots(prev => {
      const current = prev[selectedDate] || [];
      const updated = current.includes(time) 
        ? current.filter(t => t !== time)
        : [...current, time];
      return { ...prev, [selectedDate]: updated };
    });
  };

  const handleConfirm = (bookingId) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'confirmed' } : b));
  };

  const handleReject = (bookingId) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-1">Booking Session Control</h2>
          <p className="text-gray-400 text-sm sm:text-base">Terima, tolak, atau atur jadwal sesi 1-on-1 dari user.</p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl text-sm font-bold hover:bg-brand-primary/20 transition-colors self-start"
        >
          <Settings size={16} />
          {showSettings ? 'Tutup Pengaturan' : 'Atur Jam Aktif'}
        </button>
      </div>

      {/* Time Slot Settings Panel */}
      {showSettings && (
        <div className="bg-brand-secondary border border-brand-primary/20 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={20} className="text-brand-primary" />
            <div>
              <h3 className="font-bold text-base sm:text-lg">Atur Jam Aktif per Tanggal</h3>
              <p className="text-xs text-gray-400">Pilih tanggal dulu, lalu toggle jam yang aktif untuk booking.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Quick Date Selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {dates.filter(d => !d.isWeekend).slice(0, 7).map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDate(d.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    selectedDate === d.id
                      ? 'bg-brand-primary text-brand-dark'
                      : 'bg-brand-dark border border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  {d.dayName} {d.dayNum}
                </button>
              ))}
            </div>

            {/* Slot Toggles */}
            <div className="flex-grow">
              <p className="text-xs text-gray-500 mb-3">
                Jam aktif untuk <span className="text-white font-bold">{dates[selectedDate]?.dayName} {dates[selectedDate]?.dayNum} {dates[selectedDate]?.month}</span>:
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {ALL_SLOTS.map(time => {
                  const isActive = (availableSlots[selectedDate] || []).includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => toggleSlot(time)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'bg-brand-dark border border-white/10 text-gray-500 opacity-50'
                      }`}
                    >
                      {isActive ? <ToggleRight size={16} className="text-green-400" /> : <ToggleLeft size={16} />}
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Kalender Tanggal */}
        <div className="lg:col-span-1">
          <h3 className="font-bold text-base sm:text-lg mb-3">Pilih Tanggal</h3>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-3 space-y-2 max-h-[380px] sm:max-h-[420px] overflow-y-auto">
            {dates.map(d => {
              const count = bookings.filter(b => b.date === d.id).length;
              return (
                <button key={d.id} onClick={() => setSelectedDate(d.id)}
                  className={`w-full flex items-center justify-between px-3 sm:px-4 py-3 rounded-xl transition-all ${selectedDate === d.id ? 'bg-brand-primary/15 border border-brand-primary/40 text-brand-primary' : 'bg-brand-dark border border-white/5 hover:border-white/20 text-gray-300'} ${d.isWeekend ? 'opacity-40 cursor-not-allowed' : ''}`}
                  disabled={d.isWeekend}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{d.dayNum}</span>
                    <div className="text-left">
                      <p className="text-sm font-bold">{d.dayName}</p>
                      <p className="text-xs text-gray-500">{d.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {count > 0 && <span className="w-5 h-5 bg-brand-primary text-brand-dark rounded-full text-[10px] font-black flex items-center justify-center">{count}</span>}
                    {d.isWeekend && <Ban size={14} className="text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
          <button className="w-full mt-3 py-2.5 border border-dashed border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
            <Ban size={14} /> Blokir Tanggal Ini
          </button>
        </div>

        {/* Booking List + Active Slots */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-base sm:text-lg">Sesi pada {dates[selectedDate]?.dayName}, {dates[selectedDate]?.dayNum} {dates[selectedDate]?.month}</h3>
            <span className="text-xs bg-brand-secondary border border-white/10 px-3 py-1 rounded-full text-gray-400">{dayBookings.length} booking</span>
          </div>

          {/* Active Slots Overview */}
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 mb-4">
            <p className="text-xs text-gray-500 mb-2 font-bold">Jam Aktif Hari Ini:</p>
            <div className="flex flex-wrap gap-2">
              {(availableSlots[selectedDate] || []).map(time => {
                const isBooked = dayBookings.some(b => b.time === time);
                return (
                  <span key={time} className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    isBooked 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' 
                      : 'bg-green-500/10 text-green-400 border border-green-500/20'
                  }`}>
                    {time} {isBooked ? '(terisi)' : '(kosong)'}
                  </span>
                );
              })}
            </div>
          </div>

          {dayBookings.length === 0 ? (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 sm:p-12 text-center text-gray-400">
              <Clock size={40} className="mx-auto mb-3 opacity-30" />
              <p>Tidak ada booking pada tanggal ini.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dayBookings.map(bk => (
                <div key={bk.id} className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-center">
                      <p className="text-xl font-black text-brand-primary">{bk.time}</p>
                      <p className="text-[10px] text-gray-500">WIB</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{bk.user}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bk.status === 'confirmed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {bk.status === 'confirmed' ? 'Confirmed' : 'Menunggu'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    {bk.status === 'pending' && (
                      <button onClick={() => handleConfirm(bk.id)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-bold border border-green-500/30 transition-colors">
                        <CheckCircle size={12} /> Terima
                      </button>
                    )}
                    <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg text-xs font-bold border border-blue-500/20 transition-colors">
                      <RefreshCw size={12} /> Jadwal Ulang
                    </button>
                    <button onClick={() => handleReject(bk.id)} className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold border border-red-500/20 transition-colors">
                      <XCircle size={12} /> Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBooking;

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import api from '../services/api';

const BookingPage = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState(null);
  const [capacityInfo, setCapacityInfo] = useState({ remaining: 0, maxPerDay: 2, bookedCount: 0 });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: i,
      date: date,
      dateStr: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('id-ID', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('id-ID', { month: 'short' }),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });

  useEffect(() => {
    if (selectedDate === null) return;
    const dateStr = dates[selectedDate].dateStr;
    setLoading(true);
    api.getAvailableSlots(dateStr)
      .then(res => {
        if (res.success) {
          setSlots(res.slots || []);
          const maxP = res.maxPerDay || 2;
          const rem = res.remaining !== undefined ? res.remaining : Math.max(0, maxP - (res.booked || []).length);
          setCapacityInfo({ remaining: rem, maxPerDay: maxP, bookedCount: maxP - rem });
        } else {
          setSlots([]);
        }
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const availableSlots = slots.filter(t => t.available).length;

  const handleBooking = async () => {
    if (selectedDate === null || !selectedTime) return;
    setBooking(true);
    setMessage(null);
    try {
      const dateStr = dates[selectedDate].dateStr;
      const res = await api.createBooking(dateStr, selectedTime);
      if (res.success) {
        setMessage({ type: 'success', text: 'Booking berhasil! Menunggu konfirmasi admin.' });
        setSelectedTime(null);
        // Refresh slots
        const refresh = await api.getAvailableSlots(dateStr);
        if (refresh.success) {
          setSlots(refresh.slots || []);
          const maxP = refresh.maxPerDay || 2;
          const rem = refresh.remaining !== undefined ? refresh.remaining : Math.max(0, maxP - (refresh.booked || []).length);
          setCapacityInfo({ remaining: rem, maxPerDay: maxP, bookedCount: maxP - rem });
        }
      } else {
        setMessage({ type: 'error', text: res.message || 'Gagal membuat booking.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Booking Sesi 1-on-1</h2>
        <p className="text-gray-400 text-sm sm:text-base">Jadwalkan sesi privat dengan mentor. Kuota maksimal {capacityInfo.maxPerDay} pengguna per hari secara global.</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-xl p-4 mb-6 flex items-center gap-3 text-sm ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-brand-primary/10 border border-brand-primary/20 rounded-xl p-4 mb-6 sm:mb-8 flex items-center gap-4">
        <AlertCircle size={24} className="text-brand-primary shrink-0" />
        <div>
          <p className="font-bold text-brand-primary text-sm sm:text-base">Kuota Terbatas</p>
          <p className="text-xs sm:text-sm text-gray-300">Kuota: <span className="text-white font-bold">{capacityInfo.bookedCount}/{capacityInfo.maxPerDay}</span> terisi, Sisa: <span className="text-white font-bold">{capacityInfo.remaining}</span> slot. Waktu yang sudah dibooking otomatis terkunci.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Date Picker */}
        <div className="lg:col-span-1">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Pilih Tanggal</h3>
          <div className="bg-brand-secondary border border-white/10 rounded-2xl p-3 sm:p-4">
            <div className="space-y-2 max-h-[350px] sm:max-h-[400px] overflow-y-auto scrollbar-hide">
              {dates.map((date) => (
                <button
                  key={date.id}
                  onClick={() => { setSelectedDate(date.id); setSelectedTime(null); setMessage(null); }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                    selectedDate === date.id
                      ? 'bg-brand-primary/20 border border-brand-primary/50 text-brand-primary'
                      : 'bg-brand-dark border border-white/5 hover:border-white/20 text-gray-300'
                  } ${date.isWeekend ? 'opacity-50' : ''}`}
                  disabled={date.isWeekend}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <p className="font-bold text-sm">{date.dayName}</p>
                      <p className="text-xs text-gray-400">{date.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black">{date.dayNum}</span>
                    {date.isWeekend && <Lock size={14} className="text-gray-500" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="lg:col-span-2">
          <h3 className="text-lg sm:text-xl font-bold mb-4">Pilih Jam</h3>
          {selectedDate === null ? (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-gray-400">
              <Calendar size={48} className="mb-4 opacity-50" />
              <p className="text-lg">Pilih tanggal terlebih dahulu</p>
              <p className="text-sm">Klik tanggal di sebelah kiri</p>
            </div>
          ) : loading ? (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center text-gray-400">
              <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm">Memuat slot waktu...</p>
            </div>
          ) : (
            <div className="bg-brand-secondary border border-white/10 rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <p className="text-sm text-gray-400">Menampilkan slot untuk tanggal <span className="text-white font-bold">{dates[selectedDate].dayName}, {dates[selectedDate].dayNum} {dates[selectedDate].month}</span></p>
                <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold border border-green-500/20 self-start">{availableSlots} Tersedia</span>
              </div>
              
              {slots.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Tidak ada slot tersedia untuk tanggal ini.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {slots.map((slot, i) => (
                    <button
                      key={i}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 sm:p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                        !slot.available
                          ? 'bg-brand-dark/50 border-red-500/20 opacity-50 cursor-not-allowed'
                          : selectedTime === slot.time
                          ? 'bg-brand-primary/20 border-brand-primary text-brand-primary'
                          : 'bg-brand-dark border-white/10 hover:border-brand-primary/50 text-white'
                      }`}
                    >
                      {slot.available ? (
                        <>
                          <Clock size={18} className={selectedTime === slot.time ? 'text-brand-primary' : 'text-gray-400'} />
                          <span className="font-bold text-base sm:text-lg">{slot.time}</span>
                          <span className="text-[10px] sm:text-xs text-gray-400">Tersedia</span>
                        </>
                      ) : (
                        <>
                          <Lock size={18} className="text-red-400" />
                          <span className="font-bold text-base sm:text-lg line-through">{slot.time}</span>
                          <span className="text-[10px] text-red-400">Terbooking</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {selectedTime && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Jadwal Dipilih:</p>
                      <p className="font-bold text-base sm:text-lg">{dates[selectedDate].dayName}, {dates[selectedDate].dayNum} {dates[selectedDate].month} - {selectedTime} WIB</p>
                    </div>
                    <button 
                      onClick={handleBooking}
                      disabled={booking}
                      className="px-6 py-3 bg-brand-primary text-brand-dark font-bold rounded-xl hover:bg-yellow-400 transition-colors shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
                    >
                      {booking ? (
                        <>
                          <div className="w-4 h-4 border-2 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
                          Memproses...
                        </>
                      ) : (
                        'Konfirmasi Booking'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

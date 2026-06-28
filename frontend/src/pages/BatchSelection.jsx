import React, { useState } from 'react';
import { Crown, CheckSquare, DollarSign, ChevronRight, CheckCircle, AlertCircle, Shield, MessageSquare, Copy, X } from 'lucide-react';
import EnrollModal from '../components/EnrollModal';

const batches = [
  {
    id: 1,
    name: 'Batch 5: Basic',
    tier: 'Starter',
    priceIdr: 'Rp 1.500.000',
    priceUsdt: '$99',
    discordRole: 'Student',
    status: 'open',
    features: [
      'Akses Modul 1 & 2 (Fundamental & S&R)',
      'Homework & Quiz dasar',
      'Role Discord Student',
      'Grup komunitas batch',
    ]
  },
  {
    id: 2,
    name: 'Batch 6: Advanced',
    tier: 'Pro',
    priceIdr: 'Rp 3.000.000',
    priceUsdt: '$199',
    discordRole: 'Pro Trader',
    status: 'open',
    features: [
      'Akses SEMUA Modul Materi',
      'Booking Sesi 1-on-1 dengan Mentor',
      'Private Ticketing konsultasi',
      'Sinyal trading harian',
      'Role Discord Pro Trader (VIP)',
    ]
  }
];

const BatchSelection = () => {
  const [selectedBatch, setSelectedBatch] = useState(null);

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Pilih Kelas / Batch</h2>
        <p className="text-gray-400">Pilih batch yang sesuai. Setelah memilih, kamu akan mengisi formulir pendaftaran dan melakukan pembayaran.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {batches.map(batch => (
          <div key={batch.id} className={`bg-brand-secondary rounded-3xl flex flex-col overflow-hidden transition-all hover:-translate-y-1 ${
            batch.tier === 'Pro'
              ? 'border-2 border-brand-primary shadow-[0_0_30px_rgba(255,215,0,0.15)] relative'
              : 'border border-white/10'
          }`}>
            {batch.tier === 'Pro' && (
              <>
                <div className="absolute top-0 inset-x-0 h-1.5 bg-brand-primary"></div>
                <div className="absolute top-6 right-[-35px] rotate-45 bg-brand-primary text-brand-dark text-[10px] font-black py-1.5 px-10 tracking-widest uppercase">Terpopuler</div>
              </>
            )}

            <div className="p-8 border-b border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 text-xs rounded-full mb-3 font-semibold border ${batch.tier === 'Pro' ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' : 'bg-white/10 text-gray-300 border-white/10'}`}>
                    {batch.tier}
                  </span>
                  <h3 className="text-2xl font-bold">{batch.name}</h3>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-black ${batch.tier === 'Pro' ? 'text-brand-primary' : 'text-white'}`}>{batch.priceUsdt}</p>
                  <p className="text-sm text-gray-500">{batch.priceIdr}</p>
                </div>
              </div>
            </div>

            <div className="p-8 flex-grow">
              <ul className="space-y-3 mb-6">
                {batch.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <CheckCircle size={18} className="text-brand-primary shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-8 pt-0">
              <button
                onClick={() => setSelectedBatch(batch)}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  batch.tier === 'Pro'
                    ? 'bg-brand-primary text-brand-dark hover:bg-yellow-400 shadow-[0_5px_20px_rgba(255,215,0,0.25)]'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                Daftar Batch Ini <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enroll Modal */}
      {selectedBatch && (
        <EnrollModal batch={selectedBatch} onClose={() => setSelectedBatch(null)} />
      )}
    </div>
  );
};

export default BatchSelection;

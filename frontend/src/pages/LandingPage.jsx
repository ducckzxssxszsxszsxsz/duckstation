import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ArrowRight, TrendingUp, Shield, Users, Activity, ChevronRight, ChevronDown, BookOpen, Calendar, MessageSquare, Zap, Award, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── D3 NETWORK GRAPH ───
const MarketNetworkGraph = () => {
  const svgRef = useRef();

  useEffect(() => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth || 800;
    const height = svgRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`);

    const nodesData = [
      { id: "Hub", group: 0, radius: 40, label: "MARKET", type: "hub" },
      { id: "BTC", group: 1, radius: 25, label: "BTC/USDT", type: "asset", change: "+2.4%", status: "up" },
      { id: "ETH", group: 1, radius: 20, label: "ETH/USDT", type: "asset", change: "+1.1%", status: "up" },
      { id: "SOL", group: 1, radius: 18, label: "SOL/USDT", type: "asset", change: "-0.5%", status: "down" },
      { id: "XAU", group: 2, radius: 28, label: "XAU/USD", type: "asset", change: "+0.8%", status: "up" },
      { id: "EUR", group: 2, radius: 20, label: "EUR/USD", type: "asset", change: "-0.2%", status: "down" },
      { id: "GBP", group: 2, radius: 20, label: "GBP/JPY", type: "asset", change: "+0.4%", status: "up" },
      { id: "NDX", group: 3, radius: 25, label: "NASDAQ", type: "asset", change: "+1.5%", status: "up" },
      { id: "SPX", group: 3, radius: 22, label: "S&P 500", type: "asset", change: "+0.9%", status: "up" },
    ];

    const linksData = [
      { source: "Hub", target: "BTC", value: 3 },
      { source: "Hub", target: "ETH", value: 2 },
      { source: "Hub", target: "SOL", value: 1 },
      { source: "Hub", target: "XAU", value: 4 },
      { source: "Hub", target: "EUR", value: 2 },
      { source: "Hub", target: "GBP", value: 2 },
      { source: "Hub", target: "NDX", value: 3 },
      { source: "Hub", target: "SPX", value: 3 },
      { source: "BTC", target: "ETH", value: 1 },
      { source: "NDX", target: "SPX", value: 2 },
      { source: "XAU", target: "BTC", value: 1, dashed: true },
    ];

    const simulation = d3.forceSimulation(nodesData)
      .force("link", d3.forceLink(linksData).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(d => d.radius + 15));

    const link = svg.append("g").selectAll("line").data(linksData).join("line")
      .attr("stroke", d => d.dashed ? "rgba(255,100,100,0.3)" : "rgba(0,229,255,0.2)")
      .attr("stroke-width", d => d.value)
      .attr("stroke-dasharray", d => d.dashed ? "5,5" : "none");

    const nodeGroup = svg.append("g").selectAll("g").data(nodesData).join("g").call(drag(simulation));

    nodeGroup.filter(d => d.type === "hub").append("circle")
      .attr("r", d => d.radius).attr("fill", "rgba(255,215,0,0.1)")
      .attr("stroke", "#FFD700").attr("stroke-width", 2).attr("class", "pulse-hub");

    const assetNodes = nodeGroup.filter(d => d.type === "asset");
    assetNodes.append("circle").attr("r", d => d.radius).attr("fill", "#1A1A24")
      .attr("stroke", d => d.status === 'up' ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)")
      .attr("stroke-width", 2);

    nodeGroup.append("text").text(d => d.label)
      .attr("x", 0).attr("y", d => d.type === "hub" ? 0 : -d.radius - 8)
      .attr("text-anchor", "middle").attr("dominant-baseline", "middle")
      .attr("fill", "#FFF").attr("font-size", d => d.type === "hub" ? "14px" : "12px").attr("font-weight", "bold");

    assetNodes.append("text").text(d => d.change)
      .attr("x", 0).attr("y", d => d.radius + 12)
      .attr("text-anchor", "middle")
      .attr("fill", d => d.status === 'up' ? "#4ade80" : "#f87171")
      .attr("font-size", "10px").attr("font-weight", "bold");

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      nodeGroup.attr("transform", d => `translate(${d.x = Math.max(d.radius + 20, Math.min(width - d.radius - 20, d.x))},${d.y = Math.max(d.radius + 20, Math.min(height - d.radius - 20, d.y))})`);
    });

    function drag(simulation) {
      function dragstarted(event) { if (!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; }
      function dragged(event) { event.subject.fx = event.x; event.subject.fy = event.y; }
      function dragended(event) { if (!event.active) simulation.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; }
      return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
    }

    return () => simulation.stop();
  }, []);

  return (
    <>
      <style>{`.pulse-hub { animation: hubPulse 2s infinite alternate; } @keyframes hubPulse { 0% { filter: drop-shadow(0 0 10px rgba(255,215,0,0.5)); transform: scale(1); } 100% { filter: drop-shadow(0 0 30px rgba(255,215,0,0.8)); transform: scale(1.05); } }`}</style>
      <svg ref={svgRef} className="w-full h-full opacity-80"></svg>
    </>
  );
};

// ─── FAQ COMPONENT ───
const faqData = [
  { q: 'Apa itu DuckStation?', a: 'DuckStation adalah platform komunitas trading yang menyediakan materi pembelajaran terstruktur, sesi 1-on-1 dengan mentor, dan akses eksklusif ke Discord komunitas trader aktif.' },
  { q: 'Bagaimana cara bergabung?', a: 'Kamu bisa login menggunakan Google atau Discord. Setelah itu, pilih batch yang diinginkan, isi form pendaftaran lengkap, lalu lakukan pembayaran via QRIS atau transfer bank. Setelah admin mengapprove, akses materi dan Discord Role akan otomatis aktif.' },
  { q: 'Metode pembayaran apa saja yang diterima?', a: 'Kami menerima pembayaran via QRIS, transfer bank, dan e-wallet (GoPay, OVO, Dana). Setelah pembayaran dikonfirmasi, admin akan menghubungi kamu via Telegram untuk proses selanjutnya.' },
  { q: 'Bagaimana sistem booking 1-on-1?', a: 'Sesi 1-on-1 bisa dibooking melalui dashboard. Kuota maksimal 2 pengguna per hari secara global. Jadwal yang sudah dibooking orang lain otomatis terkunci dan tidak bisa dipilih.' },
  { q: 'Bagaimana jika quiz gagal?', a: 'Jika skor di bawah batas minimum (70), sistem akan mengunci progres modul berikutnya dan kamu wajib mengulang kuis (retake) sampai mencapai skor minimum.' },
  { q: 'Apa itu Discord Role otomatis?', a: 'Setelah pembayaran dikonfirmasi oleh admin, bot Discord kami akan otomatis menyematkan Role eksklusif (Student atau Pro Trader) sesuai batch yang kamu beli. Role ini memberikan akses ke channel privat di server Discord.' },
  { q: 'Apakah materi bisa diakses selamanya?', a: 'Ya, semua materi yang sudah dibeli bisa diakses selamanya (lifetime access). Update materi juga akan otomatis tersedia tanpa biaya tambahan.' },
];

const FaqItem = ({ item }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/30 transition-colors">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-5 text-left bg-brand-secondary hover:bg-white/3 transition-colors">
        <span className="font-bold text-base pr-4">{item.q}</span>
        <ChevronDown size={18} className={`text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-48' : 'max-h-0'}`}>
        <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
};

// ─── LANDING PAGE ───
const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-brand-dark overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-73px)] flex flex-col">
        <div className="absolute inset-0 z-0 opacity-40 lg:opacity-100 pointer-events-none lg:pointer-events-auto flex justify-end items-center">
          <div className="w-full lg:w-[60%] h-[80vh] mr-[-5%] mt-[-5%]">
            <MarketNetworkGraph />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex-grow flex items-center pt-10 pb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold mb-8 backdrop-blur-sm shadow-[0_0_15px_rgba(255,215,0,0.15)]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              SYSTEM ONLINE • MARKET OPEN
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[1.1] mb-6 tracking-tighter">
              THE ELITE<br/>TRADING <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-500">COMMUNITY.</span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed border-l-4 border-brand-primary pl-4">
              Bukan sekadar edukasi, ini adalah ekosistem. Bergabunglah dengan ribuan trader pro di Discord eksklusif kami. Diskusikan setup <b>Gold, NASDAQ, & Crypto</b>, akses sinyal real-time, dan berkembang bersama komunitas trading paling aktif.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button onClick={() => navigate('/dashboard')}
                className="flex items-center justify-center gap-3 px-8 py-5 bg-brand-primary text-brand-dark font-black text-lg rounded-xl hover:bg-yellow-400 transition-all hover:-translate-y-1 shadow-[0_10px_40px_rgba(255,215,0,0.3)] group">
                ENTER DASHBOARD <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-5 bg-transparent hover:bg-white/5 text-white font-semibold rounded-xl border-2 border-white/10 hover:border-white/20 transition-all backdrop-blur-sm">
                <Activity size={20} className="text-brand-accent"/> View Market Analytics
              </button>
            </div>

            <div className="mt-12 flex items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-secondary border border-white/10 flex items-center justify-center"><Users size={14}/></div>
                <span>Verified Access Only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-primary text-sm font-bold tracking-widest uppercase mb-3">Fitur Unggulan</p>
            <h2 className="text-4xl md:text-5xl font-black">Kenapa DuckStation?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen,     color: 'text-blue-400',    bg: 'bg-blue-400/10',    title: 'Materi Berjenjang',     desc: 'Kurikulum terstruktur dari fundamental hingga Smart Money Concepts. Setiap modul terdiri dari teks dan gambar berdeskripsi.' },
              { icon: Calendar,     color: 'text-brand-primary', bg: 'bg-brand-primary/10', title: 'Booking 1-on-1',        desc: 'Sesi privat dengan mentor real-time. Kuota terbatas 2 orang per hari untuk kualitas eksklusif.' },
              { icon: MessageSquare,color: 'text-purple-400',  bg: 'bg-purple-400/10',  title: 'Private Ticketing',     desc: 'Konsultasi personal langsung dengan admin. Ruang diskusi privat untuk pertanyaan spesifik.' },
              { icon: Shield,       color: 'text-green-400',   bg: 'bg-green-400/10',   title: 'Secure Authentication',    desc: 'Login via Google atau Discord. Akun kamu aman dan terhubung langsung ke komunitas.' },
              { icon: Award,        color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  title: 'Quiz & Homework',       desc: 'Sistem validasi skor minimum. Jika belum memenuhi standar, kamu wajib mengulang hingga lulus.' },
              { icon: Zap,          color: 'text-brand-accent', bg: 'bg-brand-accent/10', title: 'Real-time Market Data',  desc: 'Network graph interaktif menampilkan korelasi aset: Gold, NASDAQ, Crypto, dan Forex secara langsung.' },
            ].map((f, i) => (
              <div key={i} className="bg-brand-secondary border border-white/10 rounded-2xl p-6 hover:border-brand-primary/30 transition-all hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon size={22} className={f.color} />
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 border-t border-white/5 bg-brand-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-primary text-sm font-bold tracking-widest uppercase mb-3">Langkah Mudah</p>
            <h2 className="text-4xl md:text-5xl font-black">Cara Bergabung</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-px bg-gradient-to-r from-brand-primary/50 via-brand-accent/50 to-brand-primary/50"></div>
            {[
              { step: '01', title: 'Login Akun',         desc: 'Login via Google atau Discord kamu.',        icon: '🔐' },
              { step: '02', title: 'Pilih Batch',         desc: 'Pilih kelas sesuai level: Basic atau Pro.',        icon: '🎓' },
              { step: '03', title: 'Isi Form & Bayar',    desc: 'Lengkapi data diri, lalu bayar via QRIS atau kripto.', icon: '💳' },
              { step: '04', title: 'Mulai Belajar',       desc: 'Akses materi, booking mentor, dan bergabung Discord.', icon: '🚀' },
            ].map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-brand-secondary border-2 border-brand-primary/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(255,215,0,0.1)] relative z-10">
                  {s.icon}
                </div>
                <span className="text-[10px] font-black text-brand-primary tracking-widest">{s.step}</span>
                <h3 className="font-bold text-lg mt-1 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-brand-primary text-sm font-bold tracking-widest uppercase mb-3">Testimoni</p>
            <h2 className="text-4xl md:text-5xl font-black">Apa Kata Mereka</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Ahmad R.', role: 'Batch 6 • Pro Trader', text: 'Materi SMC-nya sangat terstruktur. Setelah apply di real market, winrate naik dari 30% ke 62%. Discord-nya juga sangat aktif!', color: 'border-brand-primary/30' },
              { name: 'Siti N.', role: 'Batch 5 • Student', text: 'Sebagai pemula, saya merasa sangat terbantu. Penjelasan fundamental-nya jelas, dan sesi 1-on-1 dengan mentor bikin saya makin paham.', color: 'border-brand-accent/30' },
              { name: 'Reza P.', role: 'Batch 6 • Pro Trader', text: 'Fitur booking 1-on-1-nya keren banget. Dapet review langsung dari mentor profesional. Investasi terbaik untuk journey trading saya.', color: 'border-purple-500/30' },
            ].map((t, i) => (
              <div key={i} className={`bg-brand-secondary border ${t.color} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-sm">{t.name[0]}</div>
                  <div>
                    <p className="font-bold text-sm">{t.name}</p>
                    <p className="text-[10px] text-gray-500">{t.role}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-brand-primary text-xs">★</span>)}
                  </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 border-t border-white/5 bg-brand-secondary/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-brand-primary text-sm font-bold tracking-widest uppercase mb-3">Tanya Jawab</p>
            <h2 className="text-4xl md:text-5xl font-black">Pertanyaan Umum</h2>
          </div>

          <div className="space-y-3">
            {faqData.map((item, i) => <FaqItem key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">Siap Memulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-accent">Perjalanan</span> Trading Kamu?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto">Bergabung sekarang dan dapatkan akses ke materi eksklusif, komunitas privat, dan bimbingan mentor profesional.</p>
          <button onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-3 px-10 py-5 bg-brand-primary text-brand-dark font-black text-lg rounded-xl hover:bg-yellow-400 transition-all hover:-translate-y-1 shadow-[0_10px_40px_rgba(255,215,0,0.3)]">
            MULAI SEKARANG <ArrowRight size={22} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-black text-lg">DuckStation</span>
            <span className="text-xs text-gray-500">© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Discord</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

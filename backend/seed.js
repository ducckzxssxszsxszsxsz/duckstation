const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');
const Batch = require('./src/models/Batch');
const Module = require('./src/models/Module');
const { Quiz } = require('./src/models/Quiz');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear
    await User.deleteMany({});
    await Batch.deleteMany({});
    await Module.deleteMany({});
    await Quiz.deleteMany({});

    // Admin user
    await User.create({
      name: 'Super Admin',
      email: 'admin@duckstation.com',
      password: 'admin123',
      role: 'admin',
      provider: 'local',
      telegram: 'admin_duck',
    });
    console.log('Admin created: admin@duckstation.com / admin123');

    // Demo user
    await User.create({
      name: 'Demo Trader',
      email: 'demo@duckstation.com',
      password: 'demo123',
      role: 'user',
      provider: 'local',
      telegram: 'demo_trader',
      discordTag: 'DemoTrader#0001',
    });
    console.log('Demo user created: demo@duckstation.com / demo123');

    // Batches
    await Batch.insertMany([
      { name: 'Batch 5: Basic', tier: 'Starter', priceIdr: 'Rp 1.500.000', priceUsdt: '$99', discordRole: 'Student', status: 'open', features: ['Akses Modul 1 & 2', 'Role Discord Student', 'Grup komunitas'] },
      { name: 'Batch 6: Advanced', tier: 'Pro', priceIdr: 'Rp 3.000.000', priceUsdt: '$199', discordRole: 'Pro Trader', status: 'open', features: ['Akses SEMUA Modul', 'Booking 1-on-1', 'Sinyal trading', 'Role Discord Pro Trader'] },
    ]);
    console.log('Batches created');

    // Modules with lessons & steps
    const mod1 = await Module.create({
      title: 'Modul 1: Fundamental Market & Candlestick',
      batch: 'Semua Batch', status: 'published', free: true, order: 1,
      lessons: [
        { title: 'Apa itu Forex & Crypto?', status: 'published', order: 1, steps: [
          { type: 'text', content: 'Forex (Foreign Exchange) adalah pasar keuangan terbesar di dunia dengan volume transaksi harian mencapai $6.6 triliun. Pasar ini beroperasi 24 jam sehari, 5 hari seminggu.', order: 1 },
          { type: 'image', imageUrl: '/images/forex-flow.png', description: 'Diagram alur cara kerja pasar Forex — Broker bertindak sebagai perantara antara retail trader dan interbank market.', order: 2 },
          { type: 'text', content: 'Crypto (Cryptocurrency) adalah aset digital yang berjalan di atas teknologi blockchain. Berbeda dengan Forex, Crypto beroperasi 24/7.', order: 3 },
          { type: 'image', imageUrl: '/images/crypto-vs-forex.png', description: 'Perbandingan Market Cap: Crypto vs Forex. Meskipun crypto tumbuh pesat, Forex masih menjadi pasar terbesar dari sisi volume.', order: 4 },
          { type: 'text', content: 'Sebagai trader, kamu berspekulasi terhadap pergerakan harga — baik naik (Buy/Long) maupun turun (Sell/Short). Ini yang disebut CFD.', order: 5 },
        ]},
        { title: 'Membaca Candlestick Dasar', status: 'published', order: 2, steps: [
          { type: 'text', content: 'Candlestick menampilkan 4 informasi: Open, High, Low, Close. Semakin besar body, semakin kuat momentum.', order: 1 },
          { type: 'image', imageUrl: '/images/candle-anatomy.png', description: 'Anatomi satu candlestick — Badan (body) = Open ke Close. Wick/shadow = High dan Low.', order: 2 },
          { type: 'text', content: 'Bullish Candle (Hijau): Close > Open. Bearish Candle (Merah): Close < Open.', order: 3 },
          { type: 'image', imageUrl: '/images/candle-patterns.png', description: 'Katalog pola candlestick dasar: Doji, Hammer, Shooting Star, Engulfing, Morning Star.', order: 4 },
        ]},
      ],
    });

    const mod2 = await Module.create({
      title: 'Modul 2: Smart Money Concepts (SMC)',
      batch: 'Batch 6 Pro', status: 'published', free: false, order: 2,
      lessons: [
        { title: 'Order Block & Breaker Block', status: 'published', order: 1, steps: [
          { type: 'text', content: 'Order Block (OB) adalah area di mana institutional order ditempatkan oleh bank dan institusi besar.', order: 1 },
          { type: 'image', imageUrl: '/images/order-block.png', description: 'Contoh Bullish Order Block pada EUR/USD. Area kuning = zona terakhir sebelum harga bergerak naik tajam.', order: 2 },
        ]},
        { title: 'Fair Value Gap (FVG)', status: 'published', order: 2, steps: [
          { type: 'text', content: 'FVG adalah ketidakseimbangan harga di mana harga bergerak terlalu cepat sehingga meninggalkan gap.', order: 1 },
          { type: 'image', imageUrl: '/images/fvg.png', description: 'Bullish FVG pada BTC/USDT — area gap antara candle pertama dan ketiga.', order: 2 },
        ]},
      ],
    });

    console.log('Modules created');

    // Quiz
    await Quiz.create({
      title: 'Quiz Pengetahuan Dasar Trading',
      description: 'Quiz wajib sebelum akses materi. Min. skor 70, maks 3x percobaan.',
      minScore: 70,
      maxAttempts: 3,
      status: 'published',
      questions: [
        { question: 'Apa singkatan dari Forex?', options: ['Foreign Exchange', 'Future Exchange', 'Financial Exchange', 'Federal Exchange'], correctIdx: 0 },
        { question: 'Berapa jam pasar Forex beroperasi dalam sehari?', options: ['8 jam', '12 jam', '24 jam', '6 jam'], correctIdx: 2 },
        { question: 'Bullish candle ditandai dengan...', options: ['Close < Open', 'Close > Open', 'Close = Open', 'Tidak ada body'], correctIdx: 1 },
        { question: 'Apa itu Order Block?', options: ['Area tempat institusi menempatkan order', 'Jenis candlestick', 'Indikator teknikal', 'Platform trading'], correctIdx: 0 },
        { question: 'FVG adalah singkatan dari?', options: ['Fair Value Gap', 'Full Volume Gap', 'Future Value Gap', 'Free Volume Gap'], correctIdx: 0 },
        { question: 'Apa yang dimaksud dengan CFD?', options: ['Contract for Difference', 'Crypto Future Derivative', 'Central Fund Deposit', 'Cash Flow Distribution'], correctIdx: 0 },
        { question: 'Skor minimum untuk lulus quiz ini adalah?', options: ['50', '60', '70', '80'], correctIdx: 2 },
        { question: 'Berapa maksimal percobaan quiz?', options: ['1', '2', '3', '5'], correctIdx: 2 },
        { question: 'Apa yang terjadi jika gagal 3x quiz?', options: ['Banned', 'Reset dari awal', 'Langsung lulus', 'Dibanned permanen'], correctIdx: 1 },
        { question: 'Hasil quiz akan dibahas saat...', options: ['Sesi 1-on-1 mentor', 'Di Discord', 'Via Telegram', 'Email'], correctIdx: 0 },
      ],
    });
    console.log('Quiz created');

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();

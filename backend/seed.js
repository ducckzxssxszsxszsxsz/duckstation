const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear ALL collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    console.log('All data cleared');

    // Admin only
    await User.create({
      name: 'Super Admin',
      email: 'admin@duckstation.com',
      password: 'admin123',
      role: 'admin',
      provider: 'local',
      telegram: 'admin_duck',
    });
    console.log('Admin created: admin@duckstation.com / admin123');

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();

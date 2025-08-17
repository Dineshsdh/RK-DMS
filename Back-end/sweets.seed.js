// sweets.seed.js - Seed 15 sweets into the database
const mongoose = require('mongoose');
const Sweet = require('./sweet.model');
const connectDB = require('./db');
mongoose.connect('mongodb://localhost:27017/rk_dms')
const sweets = [
  { name: 'Milk Palkhova', rate: 320 },
  { name: 'Dry Fruit Palkhova', rate: 400 },
  { name: 'Chocolate Palkhova', rate: 350 },
  { name: 'Mango Palkhova', rate: 340 },
  { name: 'Coconut Burfi', rate: 280 },
  { name: 'Mysore Pak', rate: 300 },
  { name: 'Badam Halwa', rate: 420 },
  { name: 'Kaju Katli', rate: 450 },
  { name: 'Rasgulla', rate: 250 },
  { name: 'Gulab Jamun', rate: 260 },
  { name: 'Laddu', rate: 220 },
  { name: 'Jangiri', rate: 230 },
  { name: 'Soan Papdi', rate: 200 },
  { name: 'Motichoor Laddu', rate: 240 },
  { name: 'Kalakand', rate: 330 }
];

async function seedSweets() {
  await connectDB();
  await Sweet.deleteMany({});
  await Sweet.insertMany(sweets);
  console.log('Sweets seeded!');
  mongoose.disconnect();
}

seedSweets();

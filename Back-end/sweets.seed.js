// sweets.seed.js - Seed sweets from Excel
const mongoose = require('mongoose');
const Sweet = require('./sweet.model');
const connectDB = require('./db');

const sweets = [
  {
    "name": "3 ROSES ROLL",
    "rate": 1200
  },
  {
    "name": "AVUL MIXTURE",
    "rate": 360
  },
  {
    "name": "BADAM KERNELS",
    "rate": 800
  },
  {
    "name": "BADAM LADDU",
    "rate": 1200
  },
  {
    "name": "BADUSHA",
    "rate": 320
  },
  {
    "name": "BOMBAY HALWA",
    "rate": 500
  },
  {
    "name": "BOONDHI LADDU",
    "rate": 300
  },
  {
    "name": "BOOST BURFY",
    "rate": 600
  },
  {
    "name": "CASHEW HALWA",
    "rate": 800
  },
  {
    "name": "CASHEW KERNELS",
    "rate": 1000
  },
  {
    "name": "CASHEW MIXTURE",
    "rate": 480
  },
  {
    "name": "CHOCOLATE KAJU ROLL",
    "rate": 1200
  },
  {
    "name": "CHOCOLATE ROLL",
    "rate": 500
  },
  {
    "name": "CLASSIC MYSOREPAK",
    "rate": 380
  },
  {
    "name": "DATES ROLL",
    "rate": 700
  },
  {
    "name": "DHAL MIXTURE",
    "rate": 360
  },
  {
    "name": "DRY RAISIN",
    "rate": 355
  },
  {
    "name": "FANCY ROLL",
    "rate": 1000
  },
  {
    "name": "FRUIT CAKE",
    "rate": 500
  },
  {
    "name": "GHEE SOANPAPDI",
    "rate": 700
  },
  {
    "name": "GRAND FUSION LADDU",
    "rate": 1400
  },
  {
    "name": "GULKHAND KAJU BISCUIT",
    "rate": 1200
  },
  {
    "name": "JANGIRI",
    "rate": 320
  },
  {
    "name": "KAJU FLOWER",
    "rate": 1200
  },
  {
    "name": "KAJU KATLI",
    "rate": 1000
  },
  {
    "name": "KAJU ROLL",
    "rate": 1200
  },
  {
    "name": "MANGO BITES",
    "rate": 1200
  },
  {
    "name": "MANGO KAJU KATHILI",
    "rate": 1200
  },
  {
    "name": "MANGO KAJU ROLL",
    "rate": 1200
  },
  {
    "name": "MAWA BITES",
    "rate": 1200
  },
  {
    "name": "MILK BURFY",
    "rate": 500
  },
  {
    "name": "MILK CAKE",
    "rate": 400
  },
  {
    "name": "MOTHI LADDU",
    "rate": 400
  },
  {
    "name": "MUNDHIRI CAKE",
    "rate": 900
  },
  {
    "name": "NUTS BURFY",
    "rate": 1200
  },
  {
    "name": "NUTS MIXTURE",
    "rate": 900
  },
  {
    "name": "ORANGE BITES",
    "rate": 1200
  },
  {
    "name": "ORANGE KAJU ROLL",
    "rate": 1200
  },
  {
    "name": "PISTA BURFY",
    "rate": 500
  },
  {
    "name": "POMO HALWA",
    "rate": 600
  },
  {
    "name": "RAJASTHAN PEDA",
    "rate": 500
  },
  {
    "name": "ROASTED PISTACHIO",
    "rate": 2000
  },
  {
    "name": "SOANPAPDI",
    "rate": 500
  },
  {
    "name": "SPL MYSOREPAK",
    "rate": 600
  },
  {
    "name": "STRAWBERRY BITES",
    "rate": 1200
  },
  {
    "name": "STRAWBERRY KAJU KATHILI",
    "rate": 1200
  },
  {
    "name": "TIRUPATHI LADDU",
    "rate": 600
  },
  {
    "name": "PISTA LADDU",
    "rate": 1200
  },
  {
    "name": "MANGO KAJU KATHILI",
    "rate": 1200
  },
  {
    "name": "CLASSIC BOX",
    "rate": 460
  },
  {
    "name": "MINI CLASSIC BOX",
    "rate": 100
  },
  {
    "name": "SPECIAL BOX",
    "rate": 600
  },
  {
    "name": "MINI SPECIAL BOX",
    "rate": 150
  },
  {
    "name": "PREMIUM BOX",
    "rate": 1200
  },
  {
    "name": "VIP BOX",
    "rate": 1250
  },
  {
    "name": "VIP FUSION BOX 1",
    "rate": 1100
  },
  {
    "name": "VIP FUSION BOX 2",
    "rate": 1100
  },
  {
    "name": "ROYAL BOX",
    "rate": 1400
  },
  {
    "name": "ELITE BOX",
    "rate": 750
  }
];

async function seedSweets() {
  await connectDB();
  await Sweet.deleteMany({});
  await Sweet.insertMany(sweets);
  console.log('Sweets seeded!');
  mongoose.disconnect();
}

seedSweets();

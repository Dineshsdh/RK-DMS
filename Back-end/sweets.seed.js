// sweets.seed.js - Seed sweets from Excel
const mongoose = require('mongoose');
const Sweet = require('./sweet.model');
const connectDB = require('./db');

const sweets = [
  {
    "name": "CASHEW KATLI",
    "rate": 1100
  },
  {
    "name": "SPECIAL MYSOREPAK",
    "rate": 800
  },
  {
    "name": "GHEE MYSOREPAK",
    "rate": 740
  },
  {
    "name": "MILK MYSOREPAK",
    "rate": 740
  },
  {
    "name": "MOTI LADDU",
    "rate": 740
  },
  {
    "name": "SPECIAL LADDU",
    "rate": 740
  },
  {
    "name": "KAJU PISTA ROLL",
    "rate": 1100
  },
  {
    "name": "KAJU STRAWBERRY",
    "rate": 1100
  },
  {
    "name": "KAJU APPLE",
    "rate": 1100
  },
  {
    "name": "KAJU GUJIYA",
    "rate": 1100
  },
  {
    "name": "KAJU SAMOSA",
    "rate": 1100
  },
  {
    "name": "KAJU ANJEER ROLL",
    "rate": 1100
  },
  {
    "name": "KAJU KHARJUR ROLL",
    "rate": 1100
  },
  {
    "name": "KAJU CHOCO BITE",
    "rate": 1100
  },
  {
    "name": "KAJU MELON BITE",
    "rate": 1100
  },
  {
    "name": "KAJU BLACKCURRANT BITE",
    "rate": 1100
  },
  {
    "name": "KAJU PINEAPPLE BITE",
    "rate": 1100
  },
  {
    "name": "KAJU ORANGE BITE",
    "rate": 1100
  },
  {
    "name": "KAJU BUTTERSCOTCH BITE",
    "rate": 1100
  },
  {
    "name": "ASSORTED SWEETS",
    "rate": 760
  },
  {
    "name": "DRY FRUIT HALWA",
    "rate": 1000
  },
  {
    "name": "SPECIAL HALWA",
    "rate": 760
  },
  {
    "name": "KARUPATTI HALWA",
    "rate": 800
  },
  {
    "name": "BADAM HALWA",
    "rate": 1200
  },
  {
    "name": "DATES HALWA",
    "rate": 800
  },
  {
    "name": "PINEAPPLE HALWA",
    "rate": 760
  },
  {
    "name": "MILK HALWA",
    "rate": 760
  },
  {
    "name": "CHOCOLATE HALWA",
    "rate": 760
  },
  {
    "name": "HORLICKS BURFI",
    "rate": 760
  },
  {
    "name": "BOOST BURFI",
    "rate": 760
  },
  {
    "name": "GULKAND BURFI",
    "rate": 760
  },
  {
    "name": "DRY FRUIT BURFI",
    "rate": 760
  },
  {
    "name": "COCONUT BURFI",
    "rate": 760
  },
  {
    "name": "BADAM BURFI",
    "rate": 1100
  },
  {
    "name": "FIG & HONEY BURFI",
    "rate": 800
  },
  {
    "name": "CHOCO CASHEW BURFI",
    "rate": 800
  },
  {
    "name": "DATES & NUTS BURFI",
    "rate": 800
  },
  {
    "name": "KARUPPATTI KOVA",
    "rate": 800
  },
  {
    "name": "GULKAND KOVA",
    "rate": 800
  },
  {
    "name": "SPECIAL KOVA",
    "rate": 800
  },
  {
    "name": "GHEE BADUSHA",
    "rate": 740
  },
  {
    "name": "GHEE JILEBI",
    "rate": 740
  },
  {
    "name": "CHANDRAKALA",
    "rate": 740
  },
  {
    "name": "SURYAKALA",
    "rate": 740
  },
  {
    "name": "ADRASAM (5 Pcs)",
    "rate": 100
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

// sweets.seed.js - Seed sweets from Excel
const mongoose = require('mongoose');
const Sweet = require('./sweet.model');
const connectDB = require('./db');

const sweets = [
  {
    "name": "PISTA BURFY",
    "rate": 500
  },
  {
    "name": "CHOCOLATE ROLL",
    "rate": 500
  },
  {
    "name": "MOTHI LADDU",
    "rate": 400
  },
  {
    "name": "MILK BURFY",
    "rate": 500
  },
  {
    "name": "MILKCAKE",
    "rate": 400
  },
  {
    "name": "BADAM SOANPPADI",
    "rate": 600
  },
  {
    "name": "BOMBAY HALWA",
    "rate": 600
  },
  {
    "name": "MINI JANGIRI",
    "rate": 300
  },
  {
    "name": "SADA LADDU",
    "rate": 300
  },
  {
    "name": "MINI BADUSHA",
    "rate": 320
  },
  {
    "name": "SADA MYSOREPAK",
    "rate": 380
  },
  {
    "name": "POMO HALWA",
    "rate": 600
  },
  {
    "name": "SPL MYSOREPAK",
    "rate": 600
  },
  {
    "name": "RK SPL LADDU",
    "rate": 600
  },
  {
    "name": "BOOST BURFY",
    "rate": 600
  },
  {
    "name": "SPL KHOVA PEDA",
    "rate": 500
  },
  {
    "name": "MUNDHIRI CAKE",
    "rate": 900
  },
  {
    "name": "DATES LADDU",
    "rate": 700
  },
  {
    "name": "CASHEW MIXTURE",
    "rate": 480
  },
  {
    "name": "KAJU FLOWER",
    "rate": 1200
  },
  {
    "name": "NUTS BURFY",
    "rate": 1200
  },
  {
    "name": "NUTS MIXTURE",
    "rate": 780
  },
  {
    "name": "AVUL MIXTURE",
    "rate": 320
  },
  {
    "name": "DHAL MIXTURE",
    "rate": 360
  },
  {
    "name": "KAJU BISCUIT",
    "rate": 1200
  },
  {
    "name": "KAJU KATLI",
    "rate": 1000
  },
  {
    "name": "BADAM LADDU",
    "rate": 1200
  },
  {
    "name": "DATES ROLL",
    "rate": 700
  },
  {
    "name": "CASHEW HALWA",
    "rate": 700
  },
  {
    "name": "DRY FRUIT CHIKKI",
    "rate": 800
  },
  {
    "name": "CASHEW SOANPAPDI",
    "rate": 800
  },
  {
    "name": "PISTA ROLL",
    "rate": 1000
  },
  {
    "name": "GRAND FUSION LADDU",
    "rate": 1400
  },
  {
    "name": "KAJU ROLL",
    "rate": 1200
  },
  {
    "name": "ROSE KAJU KATLI",
    "rate": 1200
  },
  {
    "name": "CHCOLATE BITES",
    "rate": 1200
  },
  {
    "name": "MAWA BITES",
    "rate": 1200
  },
  {
    "name": "MANGO BITES",
    "rate": 1200
  },
  {
    "name": "ORANGE BITES",
    "rate": 1200
  },
  {
    "name": "ECONOMY BOX",
    "rate": 440
  },
  {
    "name": "SPL BOX",
    "rate": 680
  },
  {
    "name": "VIP BOX",
    "rate": 1200
  },
  {
    "name": "VIP GRAND",
    "rate": 1000
  },
  {
    "name": "PREMIUM BOX",
    "rate": 100
  },
  {
    "name": "PREMIUM LITE BOX",
    "rate": 800
  },
  {
    "name": "PACKAGING CHARGE",
    "rate": 50
  },
  {
    "name": "LUXURY BOX",
    "rate": 1400
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

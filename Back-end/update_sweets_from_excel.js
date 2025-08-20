// update_sweets_from_excel.js
// Script to update sweets.seed.js from ITEM LIST.xlsx
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Support multiple possible filenames
const candidateNames = ['ITEM LIST.xlsx', 'ITEM.xlsx', 'Items.xlsx', 'items.xlsx'];
let excelPath = null;
for (const name of candidateNames) {
  const p = path.join(__dirname, name);
  if (fs.existsSync(p)) {
    excelPath = p;
    break;
  }
}
if (!excelPath) {
  console.error('Excel file not found. Expected one of: ' + candidateNames.join(', '));
  process.exit(1);
}

const seedPath = path.join(__dirname, 'sweets.seed.js');

// Read Excel file
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

// Try to find columns for name and rate
const nameKey = Object.keys(data[0]).find(k => /name|sweet/i.test(k));
const rateKey = Object.keys(data[0]).find(k => /rate|price|amount/i.test(k));

if (!nameKey || !rateKey) {
  console.error('Could not find sweet name or rate columns in Excel.');
  process.exit(1);
}

const sweets = data.map(row => ({
  name: String(row[nameKey]).trim(),
  rate: Number(row[rateKey])
})).filter(s => s.name && s.rate);

const newSeed = `// sweets.seed.js - Seed sweets from Excel\nconst mongoose = require('mongoose');\nconst Sweet = require('./sweet.model');\nconst connectDB = require('./db');\n\nconst sweets = ${JSON.stringify(sweets, null, 2)};\n\nasync function seedSweets() {\n  await connectDB();\n  await Sweet.deleteMany({});\n  await Sweet.insertMany(sweets);\n  console.log('Sweets seeded!');\n  mongoose.disconnect();\n}\n\nseedSweets();\n`;

fs.writeFileSync(seedPath, newSeed);
console.log('sweets.seed.js updated from Excel!');

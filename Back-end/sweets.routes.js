// sweets.routes.js - Routes for sweet management
const express = require('express');
const Sweet = require('./sweet.model');
const router = express.Router();

// Get all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find().sort({ name: 1 });
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get sweet by ID
router.get('/:id', async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new sweet
router.post('/', async (req, res) => {
  try {
    const { name, rate } = req.body;
    
    // Validation
    if (!name || !rate) {
      return res.status(400).json({ error: 'Name and rate are required' });
    }
    
    if (rate < 0) {
      return res.status(400).json({ error: 'Rate must be a positive number' });
    }

    const sweet = new Sweet({ name, rate });
    await sweet.save();
    res.status(201).json(sweet);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Sweet with this name already exists' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// Update sweet
router.put('/:id', async (req, res) => {
  try {
    const { name, rate } = req.body;
    
    // Validation
    if (rate && rate < 0) {
      return res.status(400).json({ error: 'Rate must be a positive number' });
    }

    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id, 
      { name, rate }, 
      { new: true, runValidators: true }
    );
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    
    res.json(sweet);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ error: 'Sweet with this name already exists' });
    } else {
      res.status(400).json({ error: err.message });
    }
  }
});

// Delete sweet
router.delete('/:id', async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted successfully', deletedSweet: sweet });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search sweets by name
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const sweets = await Sweet.find({
      name: { $regex: query, $options: 'i' }
    }).sort({ name: 1 });
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
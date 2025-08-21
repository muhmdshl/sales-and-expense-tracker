const express = require('express');
const { body, validationResult } = require('express-validator');
const Sale = require('../models/Sale');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get single sale
router.get('/:id', auth, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('createdBy', 'username');
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all sales
router.get('/', auth, async (req, res) => {
  try {
    const { date, startDate, endDate } = req.query;
    let query = {};

    if (date) {
      const selectedDate = new Date(date);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: selectedDate, $lt: nextDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const sales = await Sale.find(query)
      .populate('createdBy', 'username')
      .sort({ date: -1 });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create sale
router.post('/', auth, upload.single('attachment'), [
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('paymentType').isIn(['Cash', 'Bank Transfer', 'Cheque']).withMessage('Invalid payment type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, paymentType, note, date } = req.body;

    const sale = new Sale({
      amount: parseFloat(amount),
      paymentType,
      note,
      date: date ? new Date(date) : new Date(),
      attachment: req.file ? req.file.filename : null,
      createdBy: req.user._id
    });

    await sale.save();
    await sale.populate('createdBy', 'username');

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update sale (admin only)
router.put('/:id', auth, adminOnly, upload.single('attachment'), async (req, res) => {
  try {
    const { amount, paymentType, note, date } = req.body;
    
    const updateData = {
      amount: parseFloat(amount),
      paymentType,
      note,
      date: date ? new Date(date) : undefined
    };

    if (req.file) {
      updateData.attachment = req.file.filename;
    }

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'username');

    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete sale (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    res.json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
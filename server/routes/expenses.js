const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const { auth, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get single expense
router.get('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('createdBy', 'username');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all expenses
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

    const expenses = await Expense.find(query)
      .populate('createdBy', 'username')
      .sort({ date: -1 });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create expense
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

    const expense = new Expense({
      amount: parseFloat(amount),
      paymentType,
      note,
      date: date ? new Date(date) : new Date(),
      attachment: req.file ? req.file.filename : null,
      createdBy: req.user._id
    });

    await expense.save();
    await expense.populate('createdBy', 'username');

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update expense (admin only)
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

    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('createdBy', 'username');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete expense (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
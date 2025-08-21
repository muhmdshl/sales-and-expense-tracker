const express = require('express');
const Sale = require('../models/Sale');
const Expense = require('../models/Expense');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get dashboard summary
router.get('/summary', auth, async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const dateQuery = { date: { $gte: selectedDate, $lt: nextDay } };

    // Get sales and expenses for the selected date
    const [salesResult, expensesResult, salesCount, expensesCount] = await Promise.all([
      Sale.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Sale.countDocuments(dateQuery),
      Expense.countDocuments(dateQuery)
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;
    const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
    const remainingBalance = totalSales - totalExpenses;

    res.json({
      date: selectedDate,
      totalSales,
      totalExpenses,
      remainingBalance,
      salesCount,
      expensesCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get monthly summary
router.get('/monthly-summary', auth, async (req, res) => {
  try {
    const { year, month } = req.query;
    
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const dateQuery = { date: { $gte: startDate, $lte: endDate } };

    const [salesResult, expensesResult] = await Promise.all([
      Sale.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Expense.aggregate([
        { $match: dateQuery },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const totalSales = salesResult.length > 0 ? salesResult[0].total : 0;
    const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;

    res.json({
      period: `${year}-${month.toString().padStart(2, '0')}`,
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentType: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Cheque'],
    required: true
  },
  note: {
    type: String,
    trim: true
  },
  attachment: {
    type: String // File path
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);
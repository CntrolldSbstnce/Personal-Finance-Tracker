const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, default: Date.now, required: true },
  description: { type: String, required: true }
});

module.exports = mongoose.model('Income', incomeSchema);

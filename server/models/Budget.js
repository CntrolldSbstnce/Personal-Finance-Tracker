const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalIncome: { type: Number, default: 0 },
  totalExpenses: { type: Number, default: 0 },
  savings: { type: Number, required: true },
  description: { type: String }
});

module.exports = mongoose.model('Budget', budgetSchema);

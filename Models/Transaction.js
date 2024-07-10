const transactionSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: Number,
    type: String, // 'income' or 'expense'
    category: String,
    date: {
      type: Date,
      default: Date.now,
    },
    description: String,
  });
  
  module.exports = mongoose.model('Transaction', transactionSchema);
  
  // models/Budget.js
  const budgetSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: Number,
    period: String, // 'monthly', 'yearly', etc.
    startDate: Date,
    endDate: Date,
  });
  
  module.exports = mongoose.model('Budget', budgetSchema);
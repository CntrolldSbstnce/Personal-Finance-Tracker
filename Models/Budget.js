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
// resolvers.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const resolvers = {
  Query: {
    getUser: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.findById(user.id);
    },
    getTransactions: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Transaction.find({ userId: user.id });
    },
    getBudgets: async (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await Budget.find({ userId: user.id });
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const user = new User({ username, email, password });
      await user.save();
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return { ...user._doc, id: user.id, token };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      return { ...user._doc, id: user.id, token };
    },
    addTransaction: async (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const transaction = new Transaction({ ...args, userId: user.id });
      await transaction.save();
      return transaction;
    },
    updateTransaction: async (_, { id, ...args }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const transaction = await Transaction.findByIdAndUpdate(id, args, { new: true });
      return transaction;
    },
    deleteTransaction: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await Transaction.findByIdAndDelete(id);
      return true;
    },
    addBudget: async (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const budget = new Budget({ ...args, userId: user.id });
      await budget.save();
      return budget;
    },
    updateBudget: async (_, { id, ...args }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      const budget = await Budget.findByIdAndUpdate(id, args, { new: true });
      return budget;
    },
    deleteBudget: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      await Budget.findByIdAndDelete(id);
      return true;
    },
  },
};

module.exports = resolvers;

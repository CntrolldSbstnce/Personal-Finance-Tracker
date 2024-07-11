const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

module.exports = {
  createUser: async ({ userInput }) => {
    try {
      const existingUser = await User.findOne({ email: userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(userInput.password, 12);
      const user = new User({
        name: userInput.name,
        email: userInput.email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null, id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
      expiresIn: '1h',
    });
    return { userId: user.id, token: token, tokenExpiration: 1 };
  },
  addIncome: async ({ incomeInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const income = new Income({
      user: req.userId,
      amount: incomeInput.amount,
      category: incomeInput.category,
      date: incomeInput.date,
      description: incomeInput.description,
    });
    const result = await income.save();
    return { ...result._doc, id: result.id };
  },
  addExpense: async ({ expenseInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const expense = new Expense({
      user: req.userId,
      amount: expenseInput.amount,
      category: expenseInput.category,
      date: expenseInput.date,
      description: expenseInput.description,
    });
    const result = await expense.save();
    return { ...result._doc, id: result.id };
  },
  setBudget: async ({ budgetInput }, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const budget = new Budget({
      user: req.userId,
      totalIncome: budgetInput.totalIncome,
      totalExpenses: budgetInput.totalExpenses,
      savings: budgetInput.savings,
    });
    const result = await budget.save();
    return { ...result._doc, id: result.id };
  },
  incomes: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const incomes = await Income.find({ user: req.userId });
    return incomes.map(income => ({ ...income._doc, id: income.id }));
  },
  expenses: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const expenses = await Expense.find({ user: req.userId });
    return expenses.map(expense => ({ ...expense._doc, id: expense.id }));
  },
  budget: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const budget = await Budget.findOne({ user: req.userId });
    if (!budget) {
      return null;
    }
    return { ...budget._doc, id: budget.id };
  },
};
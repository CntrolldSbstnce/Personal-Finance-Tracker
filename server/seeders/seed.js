const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Load models
const User = require('../models/User');
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const Category = require('../models/Category');
const Budget = require('../models/Budget');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

async function seedDatabase() {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Income.deleteMany({});
    await Expense.deleteMany({});
    await Category.deleteMany({});
    await Budget.deleteMany({});
    console.log('Cleared existing data');

    // Sample users
    const user1 = new User({
      username: 'user1',
      email: 'user1@example.com',
      password: await bcrypt.hash('password1', 10)
    });
    const user2 = new User({
      username: 'user2',
      email: 'user2@example.com',
      password: await bcrypt.hash('password2', 10)
    });

    // Save users
    await user1.save();
    await user2.save();
    console.log('Users created');

    // Sample categories
    const categories = [
      { name: 'Expenses', type: 'expense', subcategories: ['Food', 'Transport', 'Mortgage', 'Utilities', 'Internet/Apps', 'Gas', 'Cell Phone', 'Miscellaneous', 'Car Payment'] },
      { name: 'Incomes', type: 'income', subcategories: ['Salary', 'Credit', 'Investment Return'] }
    ];

    const savedCategories = await Category.insertMany(categories);
    console.log('Categories created', savedCategories);

    // Sample incomes
    const incomes = [
      {
        user: user1._id,
        amount: 5000,
        category: 'Salary',
        date: new Date()
      },
      {
        user: user2._id,
        amount: 2000,
        category: 'Investment Return',
        date: new Date()
      },
      {
        user: user1._id,
        amount: 1000,
        category: 'Credit',
        date: new Date()
      }
    ];

    const savedIncomes = await Income.insertMany(incomes);
    console.log('Incomes created', savedIncomes);

    // Sample expenses
    const expenses = [
      {
        user: user1._id,
        amount: 500,
        category: 'Food',
        date: new Date()
      },
      {
        user: user2._id,
        amount: 100,
        category: 'Transport',
        date: new Date()
      },
      {
        user: user1._id,
        amount: 1500,
        category: 'Mortgage',
        date: new Date()
      },
      {
        user: user2._id,
        amount: 200,
        category: 'Utilities',
        date: new Date()
      },
      {
        user: user1._id,
        amount: 50,
        category: 'Internet/Apps',
        date: new Date()
      },
      {
        user: user2._id,
        amount: 80,
        category: 'Gas',
        date: new Date()
      },
      {
        user: user1._id,
        amount: 60,
        category: 'Cell Phone',
        date: new Date()
      },
      {
        user: user2._id,
        amount: 100,
        category: 'Miscellaneous',
        date: new Date()
      },
      {
        user: user1._id,
        amount: 300,
        category: 'Car Payment',
        date: new Date()
      }
    ];

    const savedExpenses = await Expense.insertMany(expenses);
    console.log('Expenses created', savedExpenses);

    // Sample budgets
    const budgets = [
      {
        user: user1._id,
        category: 'Food',
        amount: 1000
      },
      {
        user: user2._id,
        category: 'Transport',
        amount: 300
      }
    ];

    const savedBudgets = await Budget.insertMany(budgets);
    console.log('Budgets created', savedBudgets);

    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

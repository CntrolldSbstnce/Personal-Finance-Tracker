const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/PFT', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    await Income.deleteMany({});

    // Create initial users
    const user1 = new User({
      username: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 8),
    });

    const user2 = new User({
      username: 'jane_doe',
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 8),
    });

    await user1.save();
    await user2.save();

    // Create initial expenses
    const expenses = [
      {
        user: user1._id,
        amount: 100.0,
        category: 'Food',
        date: new Date('2023-07-15'),
        description: 'Grocery shopping',
      },
      {
        user: user1._id,
        amount: 50.0,
        category: 'Transportation',
        date: new Date('2023-07-16'),
        description: 'Gas',
      },
      {
        user: user2._id,
        amount: 200.0,
        category: 'Entertainment',
        date: new Date('2023-07-17'),
        description: 'Concert tickets',
      },
    ];

    await Expense.insertMany(expenses);

    // Create initial incomes
    const incomes = [
      {
        user: user1._id,
        amount: 500.0,
        category: 'Salary',
        date: new Date('2023-07-10'),
        description: 'Monthly salary',
      },
      {
        user: user1._id,
        amount: 150.0,
        category: 'Freelance',
        date: new Date('2023-07-11'),
        description: 'Freelance project',
      },
      {
        user: user2._id,
        amount: 700.0,
        category: 'Salary',
        date: new Date('2023-07-10'),
        description: 'Monthly salary',
      },
    ];

    await Income.insertMany(incomes);

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

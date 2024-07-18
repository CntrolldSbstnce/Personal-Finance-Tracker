const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLFloat } = require('graphql');
const { UserType, UserInputType } = require('../schemas/user');
const { ExpenseType, ExpenseInputType } = require('../schemas/expense');
const { IncomeType, IncomeInputType } = require('../schemas/income');
const { BudgetType, BudgetInputType, budgetMutations } = require('../schemas/budget');

const AuthPayload = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: {
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLString }
  }
});

const createUserMutation = {
  type: AuthPayload,
  args: {
    userInput: { type: new GraphQLNonNull(UserInputType) }
  },
  async resolve(_, { userInput }) {
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      throw new Error('User exists already.');
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      username: userInput.username,
      name: userInput.name,
      email: userInput.email,
      password: hashedPassword,
    });
    const result = await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000
    });

    return { userId: user.id, token, tokenExpiration: '1h' };
  },
};

const loginMutation = {
  type: AuthPayload,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, { email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return { userId: user.id, token, tokenExpiration: '1h' };
  },
};

const expenseQueries = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.find({ user: context.userId });
    },
  },
  expense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.findById(args.id);
    },
  },
  totalExpenses: {
    type: GraphQLFloat,
    async resolve(_, __, { userId }) {
      if (!userId) throw new Error('Unauthenticated');
      const expenses = await Expense.find({ user: userId });
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    }
  },
  totalIncome: {
    type: GraphQLFloat,
    async resolve(_, __, { userId }) {
      if (!userId) throw new Error('Unauthenticated');
      const incomes = await Income.find({ user: userId });
      return incomes.reduce((total, income) => total + income.amount, 0);
    }
  }
};

const expenseMutations = {
  addExpense: {
    type: ExpenseType,
    args: {
      expenseInput: { type: new GraphQLNonNull(ExpenseInputType) }
    },
    resolve(parent, { expenseInput }, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const expense = new Expense({
        user: context.userId,
        ...expenseInput,
      });
      return expense.save();
    },
  },
  updateExpense: {
    type: ExpenseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      category: { type: GraphQLString },
      description: { type: GraphQLString }
    },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.findByIdAndUpdate(
        args.id,
        {
          $set: {
            amount: args.amount,
            category: args.category,
            description: args.description,
          },
        },
        { new: true }
      );
    },
  },
  deleteExpense: {
    type: ExpenseType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.findByIdAndRemove(args.id);
    },
  },
};

const incomeQueries = {
  incomes: {
    type: new GraphQLList(IncomeType),
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Income.find({ user: context.userId });
    }
  },
  income: {
    type: IncomeType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Income.findById(args.id);
    }
  }
};

const incomeMutations = {
  addIncome: {
    type: IncomeType,
    args: {
      incomeInput: { type: new GraphQLNonNull(IncomeInputType) }
    },
    resolve(parent, { incomeInput }, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const income = new Income({
        user: context.userId,
        ...incomeInput
      });
      return income.save();
    }
  },
  updateIncome: {
    type: IncomeType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      category: { type: GraphQLString },
      description: { type: GraphQLString }
    },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Income.findByIdAndUpdate(
        args.id,
        {
          $set: {
            amount: args.amount,
            category: args.category,
            description: args.description
          }
        },
        { new: true }
      );
    }
  },
  deleteIncome: {
    type: IncomeType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Income.findByIdAndRemove(args.id);
    }
  }
};

module.exports = {
  Query: {
    ...expenseQueries,
    ...incomeQueries,
  },
  Mutation: {
    ...expenseMutations,
    ...incomeMutations,
    ...budgetMutations,
    createUser: createUserMutation,
    register: createUserMutation,
    login: loginMutation,
  },
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Expense = require('../models/Expense');
const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList, GraphQLFloat } = require('graphql');
const { UserType, UserInputType } = require('../schemas/user');
const { ExpenseType, ExpenseInputType } = require('../schemas/expense');

const AuthPayload = new GraphQLObjectType({
  name: 'AuthPayload',
  fields: {
    userId: { type: GraphQLID },
    token: { type: GraphQLString },
    tokenExpiration: { type: GraphQLString },
  },
});

const createUserMutation = {
  type: UserType,
  args: {
    userInput: { type: new GraphQLNonNull(UserInputType) },
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
    return { ...result._doc, password: null, id: result.id };
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
    const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
      expiresIn: '1h',
    });
    return { userId: user.id, token, tokenExpiration: '1h' };
  },
};

const expenseQueries = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    async resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      console.log('Fetching expenses for user:', context.userId);
      return await Expense.find({ user: context.userId });
    },
  },
  expense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    async resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return await Expense.findById(args.id);
    },
  },
};

const expenseMutations = {
  addExpense: {
    type: ExpenseType,
    args: {
      expenseInput: { type: new GraphQLNonNull(ExpenseInputType) },
    },
    async resolve(parent, { expenseInput }, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      const expense = new Expense({
        user: context.userId,
        ...expenseInput,
      });
      return await expense.save();
    },
  },
  updateExpense: {
    type: ExpenseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      category: { type: GraphQLString },
      description: { type: GraphQLString },
    },
    async resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return await Expense.findByIdAndUpdate(
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
    async resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return await Expense.findByIdAndRemove(args.id);
    },
  },
};

module.exports = {
  Query: {
    ...expenseQueries,
  },
  Mutation: {
    ...expenseMutations,
    createUser: createUserMutation,
    login: loginMutation,
  },
};

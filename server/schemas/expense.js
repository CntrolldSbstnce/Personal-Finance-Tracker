const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const Expense = require('../models/Expense');
const UserType = require('./user').UserType;

const ExpenseType = new GraphQLObjectType({
  name: 'Expense',
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return require('../models/User').findById(parent.user);
      }
    },
    amount: { type: GraphQLFloat },
    category: { type: GraphQLString },
    date: { type: GraphQLString }, // Change to GraphQLString
    description: { type: GraphQLString }
  })
});

const ExpenseInputType = new GraphQLInputObjectType({
  name: 'ExpenseInput',
  fields: {
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLString }, // Change to GraphQLString
    description: { type: new GraphQLNonNull(GraphQLString) }
  }
});

const expenseQueries = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.find({ user: context.userId });
    }
  },
  expense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.findById(args.id);
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
        amount: expenseInput.amount,
        category: expenseInput.category,
        date: expenseInput.date || new Date().toISOString(), // Handle date as string
        description: expenseInput.description
      });

      return expense.save();
    }
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
            description: args.description
          }
        },
        { new: true }
      );
    }
  },
  deleteExpense: {
    type: ExpenseType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }
      return Expense.findByIdAndRemove(args.id);
    }
  }
};

module.exports = {
  ExpenseType,
  ExpenseInputType,
  expenseQueries,
  expenseMutations
};

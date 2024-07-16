const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const Expense = require('../models/Expense');
const User = require('../models/User');

const ExpenseType = new GraphQLObjectType({
  name: 'Expense',
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: require('./user').UserType,
      resolve(parent, args) {
        return User.findById(parent.user);
      }
    },
    amount: { type: GraphQLFloat },
    category: { type: GraphQLString },
    date: { type: GraphQLString }
  })
});

const expenseQueries = {
  expenses: {
    type: new GraphQLList(ExpenseType),
    resolve(parent, args) {
      return Expense.find({});
    }
  },
  expense: {
    type: ExpenseType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Expense.findById(args.id);
    }
  }
};

const expenseMutations = {
  addExpense: {
    type: ExpenseType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: new GraphQLNonNull(GraphQLFloat) },
      category: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      let expense = new Expense({
        user: args.user,
        amount: args.amount,
        category: args.category
      });
      return expense.save();
    }
  },
  updateExpense: {
    type: ExpenseType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      category: { type: GraphQLString }
    },
    resolve(parent, args) {
      return Expense.findByIdAndUpdate(
        args.id,
        {
          $set: {
            amount: args.amount,
            category: args.category
          }
        },
        { new: true }
      );
    }
  },
  deleteExpense: {
    type: ExpenseType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args) {
      return Expense.findByIdAndRemove(args.id);
    }
  }
};

module.exports = {
  ExpenseType,
  expenseQueries,
  expenseMutations
};

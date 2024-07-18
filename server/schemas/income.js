const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const { GraphQLDate } = require('graphql-iso-date');
const Income = require('../models/Income');
const UserType = require('./user').UserType;

const IncomeType = new GraphQLObjectType({
  name: 'Income',
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
    date: { type: GraphQLDate },
    description: { type: GraphQLString }
  })
});

const IncomeInputType = new GraphQLInputObjectType({
  name: 'IncomeInput',
  fields: {
    amount: { type: new GraphQLNonNull(GraphQLFloat) },
    category: { type: new GraphQLNonNull(GraphQLString) },
    date: { type: GraphQLDate },
    description: { type: new GraphQLNonNull(GraphQLString) }
  }
});

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
  IncomeType,
  IncomeInputType,
  incomeQueries,
  incomeMutations
};

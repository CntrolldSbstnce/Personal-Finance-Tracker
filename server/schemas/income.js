const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const Income = require('../models/Income');
const User = require('../models/User');

const IncomeType = new GraphQLObjectType({
  name: 'Income',
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

const incomeQueries = {
  incomes: {
    type: new GraphQLList(IncomeType),
    resolve(parent, args) {
      return Income.find({});
    }
  },
  income: {
    type: IncomeType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Income.findById(args.id);
    }
  }
};

const incomeMutations = {
  addIncome: {
    type: IncomeType,
    args: {
      user: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: new GraphQLNonNull(GraphQLFloat) },
      category: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve(parent, args) {
      let income = new Income({
        user: args.user,
        amount: args.amount,
        category: args.category
      });
      return income.save();
    }
  },
  updateIncome: {
    type: IncomeType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      amount: { type: GraphQLFloat },
      category: { type: GraphQLString }
    },
    resolve(parent, args) {
      return Income.findByIdAndUpdate(
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
  deleteIncome: {
    type: IncomeType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args) {
      return Income.findByIdAndRemove(args.id);
    }
  }
};

module.exports = {
  IncomeType,
  incomeQueries,
  incomeMutations
};

const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLNonNull } = require('graphql');
const Budget = require('../models/Budget');
const UserType = require('./user').UserType;

const BudgetType = new GraphQLObjectType({
  name: 'Budget',
  fields: () => ({
    id: { type: GraphQLID },
    user: {
      type: UserType,
      resolve(parent, args) {
        return require('../models/User').findById(parent.user);
      }
    },
    totalIncome: { type: GraphQLFloat },
    totalExpenses: { type: GraphQLFloat },
    savings: { type: GraphQLFloat },
    description: { type: GraphQLString }
  })
});

const BudgetInputType = new GraphQLInputObjectType({
  name: 'BudgetInput',
  fields: {
    totalIncome: { type: new GraphQLNonNull(GraphQLFloat) },
    totalExpenses: { type: new GraphQLNonNull(GraphQLFloat) },
    savings: { type: new GraphQLNonNull(GraphQLFloat) },
    description: { type: GraphQLString }
  }
});

const budgetMutations = {
  setBudget: {
    type: BudgetType,
    args: {
      budgetInput: { type: new GraphQLNonNull(BudgetInputType) }
    },
    resolve(parent, { budgetInput }, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const budget = new Budget({
        user: context.userId,
        ...budgetInput,
      });

      return budget.save();
    }
  }
};

module.exports = {
  BudgetType,
  BudgetInputType,
  budgetMutations
};

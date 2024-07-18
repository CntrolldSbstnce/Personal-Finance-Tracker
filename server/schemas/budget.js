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
    async resolve(parent, { budgetInput }, context) {
      if (!context.isAuth) {
        throw new Error('Unauthenticated!');
      }

      const existingBudget = await Budget.findOne({ user: context.userId });
      if (existingBudget) {
        // Update existing budget
        existingBudget.savings = budgetInput.savings;
        existingBudget.description = budgetInput.description;
        return existingBudget.save();
      } else {
        // Create a new budget if none exists
        const newBudget = new Budget({
          user: context.userId,
          totalIncome: 0,
          totalExpenses: 0,
          ...budgetInput,
        });
        return newBudget.save();
      }
    }
  }
};

module.exports = {
  BudgetType,
  BudgetInputType,
  budgetMutations
};

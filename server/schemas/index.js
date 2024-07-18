const { GraphQLSchema, GraphQLObjectType, GraphQLFloat } = require('graphql');
const { expenseQueries, expenseMutations } = require('./expense');
const { budgetMutations } = require('./budget');
const { incomeQueries, incomeMutations } = require('./income');
const BudgetType = require('./budget').BudgetType;
const resolvers = require('../resolvers'); // Adjust path as necessary

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...expenseQueries,
    ...incomeQueries,
    totalExpenses: {
      type: GraphQLFloat,
      resolve: async (_, __, { userId }) => {
        if (!userId) throw new Error('Unauthenticated');
        const expenses = await require('../models/Expense').find({ user: userId });
        return expenses.reduce((total, expense) => total + expense.amount, 0);
      }
    },
    totalIncome: {
      type: GraphQLFloat,
      resolve: async (_, __, { userId }) => {
        if (!userId) throw new Error('Unauthenticated');
        const incomes = await require('../models/Income').find({ user: userId });
        return incomes.reduce((total, income) => total + income.amount, 0);
      }
    },
    budget: {
      type: BudgetType,
      resolve: async (_, __, { userId }) => {
        if (!userId) throw new Error('Unauthenticated');
        const budget = await require('../models/Budget').findOne({ user: userId });
        const expenses = await require('../models/Expense').find({ user: userId });
        const incomes = await require('../models/Income').find({ user: userId });

        if (budget) {
          budget.totalIncome = incomes.reduce((total, income) => total + income.amount, 0);
          budget.totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
          return budget;
        }
        return null;
      }
    }
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...expenseMutations,
    ...incomeMutations,
    ...budgetMutations,
    createUser: resolvers.Mutation.createUser, // Integrate createUser mutation from resolvers
    register: resolvers.Mutation.register, // Integrate register mutation from resolvers
    login: resolvers.Mutation.login, // Integrate login mutation from resolvers
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

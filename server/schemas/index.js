const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { userQueries, userMutations } = require('./user');
const { incomeQueries, incomeMutations } = require('./income');
const { expenseQueries, expenseMutations } = require('./expense');
const { categoryQueries, categoryMutations } = require('./category');
const { budgetQueries, budgetMutations } = require('./budget');

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        ...userQueries,
        ...incomeQueries,
        ...expenseQueries,
        ...categoryQueries,
        ...budgetQueries
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...userMutations,
        ...incomeMutations,
        ...expenseMutations,
        ...categoryMutations,
        ...budgetMutations
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});

const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { expenseQueries, expenseMutations } = require('./expense');
const resolvers = require('../resolvers'); // Adjust path as necessary

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    ...expenseQueries,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...expenseMutations,
    createUser: resolvers.Mutation.createUser, // Integrate createUser mutation from resolvers
    login: resolvers.Mutation.login, // Integrate login mutation from resolvers
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

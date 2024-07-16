const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { userQueries, userMutations } = require('./user');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    ...userQueries,
  },
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...userMutations,
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

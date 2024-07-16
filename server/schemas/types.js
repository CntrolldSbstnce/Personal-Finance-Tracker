const { GraphQLObjectType, GraphQLString, GraphQLID } = require('graphql');

let UserType, AuthPayloadType;

const getUserType = () => {
  if (!UserType) {
    UserType = new GraphQLObjectType({
      name: 'User',
      fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString },
      }),
    });
  }
  return UserType;
};

const getAuthPayloadType = () => {
  if (!AuthPayloadType) {
    AuthPayloadType = new GraphQLObjectType({
      name: 'AuthPayload',
      fields: () => ({
        token: { type: GraphQLString },
        user: { type: getUserType() },
      }),
    });
  }
  return AuthPayloadType;
};

module.exports = { getUserType, getAuthPayloadType };

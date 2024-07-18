const { GraphQLObjectType, GraphQLInputObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } = require('graphql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { getAuthPayloadType, getUserType } = require('./types');

dotenv.config();

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString }
  }
});

const userQueries = {
  user: {
    type: getUserType(),
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return User.findById(args.id);
    }
  },
  users: {
    type: new GraphQLList(getUserType()),
    resolve(parent, args) {
      return User.find({});
    }
  }
};
const loginMutation = {
  type: new GraphQLObjectType({
    name: 'AuthPayload',
    fields: {
      userId: { type: GraphQLID },
      token: { type: GraphQLString },
      tokenExpiration: { type: GraphQLString },
    },
  }),
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(_, { email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
      expiresIn: '1h',
    });
    return { userId: user.id, token, tokenExpiration: '1h' };
  },
};

const userMutations = {
  register: {
    type: getAuthPayloadType(),
    args: {
      username: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args) {
      let user = await User.findOne({ email: args.email });
      if (user) {
        throw new Error('User already exists');
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(args.password, salt);

      user = new User({
        username: args.username,
        email: args.email,
        password: hashedPassword
      });
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 360000
      });

      return { token, user };
    }
  },
  login: {
    type: getAuthPayloadType(),
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
      password: { type: new GraphQLNonNull(GraphQLString) }
    },
    async resolve(parent, args) {
      const user = await User.findOne({ email: args.email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(args.password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 360000
      });

      return { token, user };
    }
  }
};

module.exports = {
  UserType,
  userQueries,
  userMutations,
  loginMutation,
  UserInputType
};

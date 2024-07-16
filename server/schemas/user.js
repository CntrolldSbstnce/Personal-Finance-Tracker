const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } = require('graphql');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        username: { type: GraphQLString },
        email: { type: GraphQLString }
    })
});

const userQueries = {
    user: {
        type: UserType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
            return User.findById(args.id);
        }
    },
    users: {
        type: new GraphQLList(UserType),
        resolve(parent, args) {
            return User.find({});
        }
    }
};

const userMutations = {
    register: {
        type: UserType,
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

            return { ...user._doc, token };
        }
    },
    login: {
        type: UserType,
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

            return { ...user._doc, token };
        }
    }
};

module.exports = {
    UserType,
    userQueries,
    userMutations
};

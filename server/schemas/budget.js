const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLFloat, GraphQLList, GraphQLNonNull } = require('graphql');
const Budget = require('../models/Budget');
const User = require('../models/User');

const BudgetType = new GraphQLObjectType({
    name: 'Budget',
    fields: () => ({
        id: { type: GraphQLID },
        user: {
            type: require('./user').UserType,
            resolve(parent, args) {
                return User.findById(parent.user);
            }
        },
        category: { type: GraphQLString },
        amount: { type: GraphQLFloat },
        createdAt: { type: GraphQLString }
    })
});

const budgetQueries = {
    budgets: {
        type: new GraphQLList(BudgetType),
        resolve(parent, args) {
            return Budget.find({});
        }
    },
    budget: {
        type: BudgetType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
            return Budget.findById(args.id);
        }
    }
};

const budgetMutations = {
    addBudget: {
        type: BudgetType,
        args: {
            user: { type: new GraphQLNonNull(GraphQLID) },
            category: { type: new GraphQLNonNull(GraphQLString) },
            amount: { type: new GraphQLNonNull(GraphQLFloat) }
        },
        resolve(parent, args) {
            let budget = new Budget({
                user: args.user,
                category: args.category,
                amount: args.amount
            });
            return budget.save();
        }
    },
    updateBudget: {
        type: BudgetType,
        args: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            category: { type: GraphQLString },
            amount: { type: GraphQLFloat }
        },
        resolve(parent, args) {
            return Budget.findByIdAndUpdate(
                args.id,
                {
                    $set: {
                        category: args.category,
                        amount: args.amount
                    }
                },
                { new: true }
            );
        }
    },
    deleteBudget: {
        type: BudgetType,
        args: { id: { type: new GraphQLNonNull(GraphQLID) } },
        resolve(parent, args) {
            return Budget.findByIdAndRemove(args.id);
        }
    }
};

module.exports = {
    BudgetType,
    budgetQueries,
    budgetMutations
};

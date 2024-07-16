const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLList } = require('graphql');
const Category = require('../models/Category');

const CategoryType = new GraphQLObjectType({
  name: 'Category',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    type: { type: GraphQLString },
    subcategories: { type: new GraphQLList(GraphQLString) }
  })
});

const categoryQueries = {
  categories: {
    type: new GraphQLList(CategoryType),
    resolve(parent, args) {
      return Category.find({});
    }
  },
  category: {
    type: CategoryType,
    args: { id: { type: GraphQLID } },
    resolve(parent, args) {
      return Category.findById(args.id);
    }
  }
};

const categoryMutations = {
  addCategory: {
    type: CategoryType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      type: { type: new GraphQLNonNull(GraphQLString) },
      subcategories: { type: new GraphQLList(GraphQLString) }
    },
    resolve(parent, args) {
      let category = new Category({
        name: args.name,
        type: args.type,
        subcategories: args.subcategories
      });
      return category.save();
    }
  },
  updateCategory: {
    type: CategoryType,
    args: {
      id: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      type: { type: GraphQLString },
      subcategories: { type: new GraphQLList(GraphQLString) }
    },
    resolve(parent, args) {
      return Category.findByIdAndUpdate(
        args.id,
        {
          $set: {
            name: args.name,
            type: args.type,
            subcategories: args.subcategories
          }
        },
        { new: true }
      );
    }
  },
  deleteCategory: {
    type: CategoryType,
    args: { id: { type: new GraphQLNonNull(GraphQLID) } },
    resolve(parent, args) {
      return Category.findByIdAndRemove(args.id);
    }
  }
};

module.exports = {
  CategoryType,
  categoryQueries,
  categoryMutations
};

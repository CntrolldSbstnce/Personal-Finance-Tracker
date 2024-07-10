// schema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Transaction {
    id: ID!
    amount: Float!
    type: String!
    category: String!
    date: String!
    description: String
    user: User!
  }

  type Budget {
    id: ID!
    amount: Float!
    period: String!
    startDate: String!
    endDate: String!
    user: User!
  }

  type Query {
    getUser: User
    getTransactions: [Transaction]
    getBudgets: [Budget]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    addTransaction(amount: Float!, type: String!, category: String!, date: String!, description: String): Transaction
    updateTransaction(id: ID!, amount: Float, type: String, category: String, date: String, description: String): Transaction
    deleteTransaction(id: ID!): Boolean
    addBudget(amount: Float!, period: String!, startDate: String!, endDate: String!): Budget
    updateBudget(id: ID!, amount: Float, period: String, startDate: String, endDate: String): Budget
    deleteBudget(id: ID!): Boolean
  }
`;

module.exports = typeDefs;

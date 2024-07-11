const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type Income {
    id: ID!
    user: User!
    amount: Float!
    category: String!
    date: String!
    description: String
  }

  type Expense {
    id: ID!
    user: User!
    amount: Float!
    category: String!
    date: String!
    description: String
  }

  type Budget {
    id: ID!
    user: User!
    totalIncome: Float!
    totalExpenses: Float!
    savings: Float!
    date: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
  }

  input IncomeInput {
    amount: Float!
    category: String!
    date: String
    description: String
  }

  input ExpenseInput {
    amount: Float!
    category: String!
    date: String
    description: String
  }

  input BudgetInput {
    totalIncome: Float!
    totalExpenses: Float!
    savings: Float!
  }

  type RootQuery {
    login(email: String!, password: String!): AuthData!
    incomes: [Income!]!
    expenses: [Expense!]!
    budget: Budget
  }

  type RootMutation {
    createUser(userInput: UserInput): User
    addIncome(incomeInput: IncomeInput): Income
    addExpense(expenseInput: ExpenseInput): Expense
    setBudget(budgetInput: BudgetInput): Budget
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);

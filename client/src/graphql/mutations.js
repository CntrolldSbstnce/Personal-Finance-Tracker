import { gql } from '@apollo/client';

export const ADD_EXPENSE = gql`
  mutation AddExpense($expenseInput: ExpenseInput!) {
    addExpense(expenseInput: $expenseInput) {
      id
      amount
      category
      date
      description
    }
  }
`;

export const ADD_INCOME = gql`
  mutation AddIncome($incomeInput: IncomeInput!) {
    addIncome(incomeInput: $incomeInput) {
      id
      amount
      category
      date
      description
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id) {
      id
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;

export const REGISTER_USER = gql`
  mutation Register($userInput: UserInput!) {
    register(userInput: $userInput) {
      userId
      token
      tokenExpiration
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      userId
      token
      tokenExpiration
    }
  }
`;

export const SET_BUDGET = gql`
  mutation SetBudget($budgetInput: BudgetInput!) {
    setBudget(budgetInput: $budgetInput) {
      id
      totalIncome
      totalExpenses
      savings
      description
    }
  }
`;

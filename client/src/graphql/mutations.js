import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
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
export const ADD_EXPENSE_MUTATION = gql`
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
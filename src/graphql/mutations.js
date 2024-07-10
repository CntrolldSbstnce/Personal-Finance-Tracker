// src/graphql/mutations.js
import { gql } from '@apollo/client';

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const REGISTER = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      token
    }
  }
`;

export const ADD_TRANSACTION = gql`
  mutation AddTransaction($amount: Float!, $type: String!, $category: String!, $date: String!, $description: String!) {
    addTransaction(amount: $amount, type: $type, category: $category, date: $date, description: $description) {
      id
      amount
      type
      category
      date
      description
    }
  }
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $amount: Float, $type: String, $category: String, $date: String, $description: String) {
    updateTransaction(id: $id, amount: $amount, type: $type, category: $category, date: $date, description: $description) {
      id
      amount
      type
      category
      date
      description
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export const ADD_BUDGET = gql`
  mutation AddBudget($amount: Float!, $period: String!, $startDate: String!, $endDate: String!) {
    addBudget(amount: $amount, period: $period, startDate: $startDate, endDate: $endDate) {
      id
      amount
      period
      startDate
      endDate
    }
  }
`;

export const UPDATE_BUDGET = gql`
  mutation UpdateBudget($id: ID!, $amount: Float, $period: String, $startDate: String, $endDate: String) {
    updateBudget(id: $id, amount: $amount, period: $period, startDate: $startDate, endDate: $endDate) {
      id
      amount
      period
      startDate
      endDate
    }
  }
`;

export const DELETE_BUDGET = gql`
  mutation DeleteBudget($id: ID!) {
    deleteBudget(id: $id)
  }
`;

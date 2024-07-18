import { gql } from '@apollo/client';

export const GET_EXPENSES = gql`
  query GetExpenses {
    expenses {
      id
      amount
      category
      date
      description
    }
  }
`;

export const GET_INCOMES = gql`
  query GetIncomes {
    incomes {
      id
      amount
      category
      date
      description
    }
  }
`;

export const GET_TOTALS = gql`
  query GetTotals {
    totalExpenses
    totalIncome
  }
`;

export const GET_BUDGET = gql`
  query GetBudget {
    budget {
      id
      totalIncome
      totalExpenses
      savings
      description
    }
  }
`;

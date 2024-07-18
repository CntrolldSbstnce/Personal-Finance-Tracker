import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import BudgetForm from './BudgetForm';

const GET_BUDGET = gql`
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

const Budget = () => {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET);
  const [budget, setBudget] = useState(null);

  useEffect(() => {
    if (data && data.budget) {
      setBudget(data.budget);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Budget</h2>
      <BudgetForm refetchBudget={refetch} />
      {budget && (
        <div>
          <p>Total Income: {budget.totalIncome}</p>
          <p>Total Expenses: {budget.totalExpenses}</p>
          <p>Savings: {budget.savings}</p>
          <p>Description: {budget.description}</p>
        </div>
      )}
    </div>
  );
};

export default Budget;

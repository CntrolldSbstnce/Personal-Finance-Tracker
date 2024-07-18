import React, { useEffect, useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

const GET_BUDGET = gql`
  query GetBudget {
    budget {
      id
      savings
      description
    }
    totalExpenses
    totalIncome
  }
`;

const SET_SAVINGS_MUTATION = gql`
  mutation SetBudget($budgetInput: BudgetInput!) {
    setBudget(budgetInput: $budgetInput) {
      id
      savings
      description
    }
  }
`;

const Budget = () => {
  const { loading, error, data, refetch } = useQuery(GET_BUDGET);
  const [savings, setSavings] = useState('');
  const [description, setDescription] = useState('');

  const [setBudgetMutation, { loading: budgetLoading, error: budgetError }] = useMutation(SET_SAVINGS_MUTATION, {
    onCompleted: () => {
      refetch();
      setSavings('');
      setDescription('');
    }
  });

  useEffect(() => {
    if (data) {
      setSavings(data.budget?.savings || '');
      setDescription(data.budget?.description || '');
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setBudgetMutation({
        variables: {
          budgetInput: {
            totalIncome: data.totalIncome,
            totalExpenses: data.totalExpenses,
            savings: parseFloat(savings),
            description
          }
        }
      });
    } catch (err) {
      console.error('Error setting budget:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Budget</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Total Income</label>
          <p>{data.totalIncome}</p>
        </div>
        <div>
          <label>Total Expenses</label>
          <p>{data.totalExpenses}</p>
        </div>
        <div>
          <label>Savings</label>
          <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} required />
        </div>
        <div>
          <label>Description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit" disabled={budgetLoading}>
          {budgetLoading ? 'Saving...' : 'Set Savings'}
        </button>
        {budgetError && <p>Error: {budgetError.message}</p>}
      </form>
      {data.budget && (
        <div>
          <p>Savings: {data.budget.savings}</p>
          <p>Description: {data.budget.description}</p>
        </div>
      )}
    </div>
  );
};

export default Budget;

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const SET_BUDGET_MUTATION = gql`
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

const BudgetForm = ({ refetchBudget }) => {
  const [savings, setSavings] = useState('');
  const [description, setDescription] = useState('');

  const [setBudget, { loading, error }] = useMutation(SET_BUDGET_MUTATION, {
    onCompleted: () => {
      refetchBudget();
      setSavings('');
      setDescription('');
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await setBudget({
        variables: {
          budgetInput: {
            savings: parseFloat(savings),
            description
          }
        }
      });
    } catch (err) {
      console.error('Error setting budget:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Savings</label>
        <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} required />
      </div>
      <div>
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Set Budget'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default BudgetForm;

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
  const [totalIncome, setTotalIncome] = useState('');
  const [totalExpenses, setTotalExpenses] = useState('');
  const [savings, setSavings] = useState('');
  const [description, setDescription] = useState('');

  const [setBudget, { loading, error }] = useMutation(SET_BUDGET_MUTATION, {
    onCompleted: () => {
      refetchBudget();
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      await setBudget({
        variables: {
          budgetInput: {
            totalIncome: parseFloat(totalIncome),
            totalExpenses: parseFloat(totalExpenses),
            savings: parseFloat(savings),
            description
          }
        }
      });
      setTotalIncome('');
      setTotalExpenses('');
      setSavings('');
      setDescription('');
    } catch (err) {
      console.error('Error setting budget:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Total Income</label>
        <input type="number" value={totalIncome} onChange={(e) => setTotalIncome(e.target.value)} required />
      </div>
      <div>
        <label>Total Expenses</label>
        <input type="number" value={totalExpenses} onChange={(e) => setTotalExpenses(e.target.value)} required />
      </div>
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

import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import Expenses from '../components/Expenses';

const ADD_EXPENSE = gql`
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

const IncomeExpenses = () => {
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  
  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE, {
    onCompleted: () => {
      setMessage('Expense added successfully!');
      // Clear form fields after submission
      setDate('');
      setCategory('');
      setAmount('');
      setDescription('');
    },
    onError: (err) => {
      setMessage(`Error: ${err.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addExpense({ variables: { expenseInput: { amount: parseFloat(amount), category, date, description } } });
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <div>
      <h2>Income & Expenses</h2>
      <div>
        <h3>Add New Entry</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div>
            <label>Category</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label>Amount</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <label>Description</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </form>
        {error && <p>Error: {error.message}</p>}
        {message && <p>{message}</p>}
      </div>
      <div>
        <h3>Existing Entries</h3>
        <Expenses /> {/* Include the Expenses component */}
      </div>
    </div>
  );
};

export default IncomeExpenses;

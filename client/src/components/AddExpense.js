import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const ADD_EXPENSE_MUTATION = gql`
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

const AddExpense = ({ refetchExpenses }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE_MUTATION, {
    onCompleted: () => {
      refetchExpenses(); // Refetch expenses after adding a new one
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addExpense({
        variables: {
          expenseInput: {
            amount: parseFloat(amount),
            category,
            date, // Send date as string
            description
          }
        }
      });
      // Reset form fields after successful submission
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        required
      />
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        required
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Expense'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
};

export default AddExpense;

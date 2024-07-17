import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { ADD_EXPENSE_MUTATION } from '../graphql/mutations'; // Ensure the correct path to your mutations file

const AddExpense = ({ refetchExpenses }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const [addExpense, { loading, error }] = useMutation(ADD_EXPENSE_MUTATION, {
    onCompleted: () => {
      refetchExpenses(); // Refetch expenses after adding a new one
      setMessage('Expense added successfully!');
      // Reset form fields after successful submission
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
    },
    onError: (err) => {
      setMessage(`Error: ${err.message}`);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the date string for debugging
      console.log('Date String:', date);

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
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  return (
    <div>
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
      </form>
      {message && <p>{message}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default AddExpense;

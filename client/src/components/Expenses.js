import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import AddExpense from './AddExpense'; // Import the AddExpense component

const GET_EXPENSES = gql`
  query {
    expenses {
      id
      amount
      category
      date
      description
    }
  }
`;

const Expenses = () => {
  const { loading, error, data, refetch } = useQuery(GET_EXPENSES); // Add refetch to refetch the expenses
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (data && data.expenses) {
      setExpenses(data.expenses);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Expenses</h2>
      <AddExpense refetchExpenses={refetch} /> {/* Pass refetch function to AddExpense */}
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <p>Amount: {expense.amount}</p>
            <p>Category: {expense.category}</p>
            <p>Date: {expense.date ? new Date(expense.date).toLocaleDateString() : 'N/A'}</p>
            <p>Description: {expense.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Expenses;

import React, { useEffect, useState } from 'react';

const Expenses = ({ expenses, deleteExpense }) => {
  const [localExpenses, setLocalExpenses] = useState([]);

  useEffect(() => {
    setLocalExpenses(expenses);
  }, [expenses]);

  return (
    <ul>
      {localExpenses.map((expense) => (
        <li key={expense.id}>
          <p>Amount: {expense.amount}</p>
          <p>Category: {expense.category}</p>
          <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
          <p>Description: {expense.description}</p>
          <button onClick={() => deleteExpense({ variables: { id: expense.id } })}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Expenses;

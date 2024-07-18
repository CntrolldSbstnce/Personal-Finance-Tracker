import React, { useEffect, useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id) {
      id
    }
  }
`;

const Incomes = ({ incomes, refetchIncomes }) => {
  const [localIncomes, setLocalIncomes] = useState(incomes);
  const [deleteIncome] = useMutation(DELETE_INCOME, {
    onCompleted: () => {
      refetchIncomes();
    }
  });

  useEffect(() => {
    setLocalIncomes(incomes);
  }, [incomes]);

  const handleDelete = async (id) => {
    try {
      await deleteIncome({ variables: { id } });
    } catch (err) {
      console.error('Error deleting income:', err);
    }
  };

  return (
    <ul>
      {localIncomes.map((income) => (
        <li key={income.id}>
          <p>Amount: {income.amount}</p>
          <p>Category: {income.category}</p>
          <p>Date: {income.date ? new Date(income.date).toLocaleDateString() : 'N/A'}</p>
          <p>Description: {income.description}</p>
          <button onClick={() => handleDelete(income.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Incomes;

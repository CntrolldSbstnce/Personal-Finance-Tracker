import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EXPENSES, GET_INCOMES } from '../graphql/queries';
import { ADD_EXPENSE, ADD_INCOME, DELETE_EXPENSE, DELETE_INCOME } from '../graphql/mutations';
import Expenses from '../components/Expenses';
import Incomes from '../components/Incomes';

const IncomeExpenses = () => {
  const { loading: loadingExpenses, error: errorExpenses, data: dataExpenses, refetch: refetchExpenses } = useQuery(GET_EXPENSES);
  const { loading: loadingIncomes, error: errorIncomes, data: dataIncomes, refetch: refetchIncomes } = useQuery(GET_INCOMES);

  const [addExpense] = useMutation(ADD_EXPENSE, {
    onCompleted: () => refetchExpenses()
  });
  const [addIncome] = useMutation(ADD_INCOME, {
    onCompleted: () => refetchIncomes()
  });
  const [deleteExpense] = useMutation(DELETE_EXPENSE, {
    onCompleted: () => refetchExpenses()
  });
  const [deleteIncome] = useMutation(DELETE_INCOME, {
    onCompleted: () => refetchIncomes()
  });

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { type, amount, category, date, description } = formData;
    try {
      if (type === 'expense') {
        await addExpense({ variables: { expenseInput: { amount: parseFloat(amount), category, date, description } } });
      } else {
        await addIncome({ variables: { incomeInput: { amount: parseFloat(amount), category, date, description } } });
      }
      setFormData({ type: 'expense', amount: '', category: '', date: '', description: '' });
    } catch (err) {
      console.error('Error adding entry:', err);
    }
  };

  if (loadingExpenses || loadingIncomes) return <p>Loading...</p>;
  if (errorExpenses) return <p>Error loading expenses: {errorExpenses.message}</p>;
  if (errorIncomes) return <p>Error loading incomes: {errorIncomes.message}</p>;

  return (
    <div>
      <h2>Income & Expenses</h2>
      <div>
        <h3>Add New Entry</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          </div>
          <div>
            <label>Amount</label>
            <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          </div>
          <div>
            <label>Description</label>
            <input type="text" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <h3>Existing Entries</h3>
        <h4>Expenses</h4>
        <Expenses expenses={dataExpenses.expenses} deleteExpense={deleteExpense} />
        <h4>Incomes</h4>
        <Incomes incomes={dataIncomes.incomes} deleteIncome={deleteIncome} />
      </div>
    </div>
  );
};

export default IncomeExpenses;

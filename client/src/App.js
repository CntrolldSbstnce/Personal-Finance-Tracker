import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncomeExpenses from './pages/IncomeExpenses';
import Budget from './pages/Budget';
import SavingsGoals from './pages/SavingsGoals';
import FinancialSummary from './pages/FinancialSummary';
import Expenses from './components/Expenses'; // Adjust the import path as necessary

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/income-expenses" element={<IncomeExpenses />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/savings-goals" element={<SavingsGoals />} />
      <Route path="/financial-summary" element={<FinancialSummary />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;

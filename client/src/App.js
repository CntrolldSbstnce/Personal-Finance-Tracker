import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import IncomeExpenses from './pages/IncomeExpenses';
import Budget from './components/Budget';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/income-expenses" element={<IncomeExpenses />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/" element={<Login />} />
    </Routes>
  );
};

export default App;

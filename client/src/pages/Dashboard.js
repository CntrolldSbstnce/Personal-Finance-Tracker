import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/income-expenses">Income & Expenses</Link>
          </li>
          <li>
            <Link to="/budget">Budget</Link>
          </li>
          <li>
            <Link to="/savings-goals">Savings Goals</Link>
          </li>
          <li>
            <Link to="/financial-summary">Financial Summary</Link>
          </li>
        </ul>
      </nav>
      <div>
        <h3>Overview</h3>
        <p>Total Income: $XXXX</p>
        <p>Total Expenses: $XXXX</p>
        <p>Remaining Budget: $XXXX</p>
      </div>
    </div>
  );
};

export default Dashboard;

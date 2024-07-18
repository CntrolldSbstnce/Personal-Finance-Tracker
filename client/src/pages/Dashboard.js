import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate} from "react-router-dom";

const Dashboard = () => {
  let navigate = useNavigate();
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={() => navigate(-1)}>Back</button>
      <nav>
        <ul>
          <li>
            <Link to="/income-expenses">Income & Expenses</Link>
          </li>
          <li>
            <Link to="/budget">Budget</Link>
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

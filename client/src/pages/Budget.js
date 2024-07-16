import React from 'react';

const Budget = () => {
  return (
    <div>
      <h2>Budget</h2>
      <div>
        <h3>Set New Budget</h3>
        <form>
          <div>
            <label>Category</label>
            <input type="text" />
          </div>
          <div>
            <label>Amount</label>
            <input type="number" />
          </div>
          <button type="submit">Set Budget</button>
        </form>
      </div>
      <div>
        <h3>Existing Budgets</h3>
        <ul>
          <li>
            <span>Category</span>
            <span>Amount</span>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Budget;

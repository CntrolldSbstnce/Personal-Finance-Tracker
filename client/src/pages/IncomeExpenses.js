import React from 'react';

const IncomeExpenses = () => {
  return (
    <div>
      <h2>Income & Expenses</h2>
      <div>
        <h3>Add New Entry</h3>
        <form>
          <div>
            <label>Date</label>
            <input type="date" />
          </div>
          <div>
            <label>Category</label>
            <input type="text" />
          </div>
          <div>
            <label>Amount</label>
            <input type="number" />
          </div>
          <div>
            <label>Description</label>
            <input type="text" />
          </div>
          <button type="submit">Add</button>
        </form>
      </div>
      <div>
        <h3>Existing Entries</h3>
        <ul>
          <li>
            <span>Date</span>
            <span>Category</span>
            <span>Amount</span>
            <span>Description</span>
            <button>Edit</button>
            <button>Delete</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default IncomeExpenses;

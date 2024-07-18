import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import styled from 'styled-components';
import logo from '../assets/logo.png'; // Ensure this path is correct

const GET_TOTALS = gql`
  query GetTotals {
    totalExpenses
    totalIncome
  }
`;

const Dashboard = () => {
  let navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_TOTALS);
  const [totals, setTotals] = useState({ totalExpenses: 0, totalIncome: 0, remainingBudget: 0 });

  useEffect(() => {
    if (data) {
      const { totalExpenses, totalIncome } = data;
      const remainingBudget = totalIncome - totalExpenses;
      setTotals({ totalExpenses, totalIncome, remainingBudget });
    }
  }, [data]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Container>
      <Header>
        <Logo src={logo} alt="F.I.D.O. Logo" />
        <Title>F.I.D.O. - Financial Informed Decision Organizer</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <Nav>
        <NavItem>
          <Link to="/income-expenses">Income & Expenses</Link>
        </NavItem>
        <NavItem>
          <Link to="/budget">Budget</Link>
        </NavItem>
        <NavItem>
          <Link to="/financial-summary">Financial Summary</Link>
        </NavItem>
      </Nav>
      <Overview>
        <h3>Overview</h3>
        <p>Total Income: ${totals.totalIncome.toFixed(2)}</p>
        <p>Total Expenses: ${totals.totalExpenses.toFixed(2)}</p>
        <p>Remaining Funds: ${totals.remainingBudget.toFixed(2)}</p>
      </Overview>
    </Container>
  );
};

export default Dashboard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #70cfdb;
  min-height: 100vh;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 2rem;
`;

const Logo = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 1rem;
`;

const Title = styled.h1`
  color: #37312f;
  font-size: 1.5rem;
  flex-grow: 1;
  text-align: center;
`;

const LogoutButton = styled.button`
  background-color: #37312f;
  color: #eceef0;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #eceef0;
    color: #37312f;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavItem = styled.div`
  a {
    text-decoration: none;
    color: #eceef0;
    background-color: #37312f;
    padding: 0.5rem 1rem;
    border-radius: 5px;

    &:hover {
      background-color: #eceef0;
      color: #37312f;
    }
  }
`;

const Overview = styled.div`
  background-color: #eceef0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;

  h3 {
    color: #37312f;
  }

  p {
    margin: 0.5rem 0;
    color: #37312f;
  }
`;

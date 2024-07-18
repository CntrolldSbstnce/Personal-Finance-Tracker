import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { LOGIN_USER, REGISTER_USER } from '../graphql/mutations';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [registerUser, { loading: registerLoading, error: registerError }] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.register.token);
      navigate('/dashboard');
    }
  });

  const [loginUser, { loading: loginLoading, error: loginError }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      navigate('/dashboard');
    }
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser({ variables: { email, password } });
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser({ variables: { username, email, password } });
    } catch (err) {
      console.error('Register error:', err);
    }
  };

  return (
    <Container>
      <FormContainer>
        <h2>{isRegistering ? 'Register' : 'Login'}</h2>
        <Form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
          {isRegistering && (
            <div>
              <label>Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
              />
            </div>
          )}
          <div>
            <label>Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <Button type="submit" disabled={isRegistering ? registerLoading : loginLoading}>
            {isRegistering ? (registerLoading ? 'Registering...' : 'Register') : (loginLoading ? 'Logging in...' : 'Login')}
          </Button>
          {isRegistering ? registerError && <p>Error: {registerError.message}</p> : loginError && <p>Error: {loginError.message}</p>}
        </Form>
        <ToggleLink onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
        </ToggleLink>
      </FormContainer>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #70cfdb;
`;

const FormContainer = styled.div`
  background-color: #eceef0;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #dcdfde;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  background-color: #37312f;
  color: #ffffff;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #70cfdb;
    color: #37312f;
  }
`;

const ToggleLink = styled.span`
  margin-top: 1rem;
  display: inline-block;
  color: #37312f;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

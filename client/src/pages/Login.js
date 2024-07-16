import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { REGISTER_USER, LOGIN_USER } from '../graphql/mutations';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const [registerUser] = useMutation(REGISTER_USER);
  const [loginUser] = useMutation(LOGIN_USER);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to log in...', { email, password });
      const { data } = await loginUser({ variables: { email, password } });
      console.log('Login response:', data);
      localStorage.setItem('token', data.login.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting to register...', { username, email, password });
      const { data } = await registerUser({ variables: { username, email, password } });
      console.log('Register response:', data);
      localStorage.setItem('token', data.register.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
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
              required
            />
          </div>
          <div>
            <label>Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit">{isRegistering ? 'Register' : 'Login'}</Button>
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

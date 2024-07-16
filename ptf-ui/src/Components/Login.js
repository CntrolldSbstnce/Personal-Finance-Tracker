// // src/components/Login.js
// import React, { useState } from 'react';
// import { useMutation } from '@apollo/client';
// import { LOGIN } from '../graphql/mutations';
// import { useHistory } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [login, { loading, error }] = useMutation(LOGIN);
//   const history = useHistory();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await login({ variables: { email, password } });
//       localStorage.setItem('token', data.login.token);
//       history.push('/dashboard');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit" disabled={loading}>
//         {loading ? 'Loading...' : 'Login'}
//       </button>
//       {error && <p>Error logging in</p>}
//     </form>
//   );
// };

// export default Login;


import React from 'react';

function Login() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;


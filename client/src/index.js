import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ApolloProviderWrapper from './apolloClient';

ReactDOM.render(
  <ApolloProviderWrapper>
    <Router>
      <App />
    </Router>
  </ApolloProviderWrapper>,
  document.getElementById('root')
);

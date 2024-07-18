import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import ApolloProviderWrapper from './apolloClient';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <ApolloProviderWrapper>
    <Router>
      <App />
    </Router>
  </ApolloProviderWrapper>
);

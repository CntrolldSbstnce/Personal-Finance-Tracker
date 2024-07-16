const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const connectDB = require('./config/connection');
const schema = require('./schema');
const auth = require('./middleware/auth');
const react = require('react');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Connect Database
connectDB();

app.use(cors());
app.use(auth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

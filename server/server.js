const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const connectDB = require('./config/connection');
const schema = require('./schema');
const auth = require('./middleware/auth');
require('dotenv').config();

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

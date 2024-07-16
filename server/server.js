const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const schema = require('./schemas');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Ensure CORS is configured
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// GraphQL setup
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

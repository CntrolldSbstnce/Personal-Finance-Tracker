const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const cors = require('cors');
const schema = require('./schemas'); // Ensure the correct path
const connectDB = require('./config/connection'); // Adjust the path if necessary
const isAuth = require('./middleware/auth'); // Adjust the path if necessary

const app = express();

// Middleware and other setups
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(isAuth); // Use authentication middleware

// Connect to MongoDB
connectDB();

// Example route
app.get('/', (req, res) => {
  res.send('API Running');
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}));

// Define port and start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

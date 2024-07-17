const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const connectDB = require('./config/connection'); // Adjust the path if necessary
const isAuth = require('./middleware/auth'); // Adjust the path if necessary
const typeDefs = require('./schemas'); // Ensure the correct path to your type definitions
const resolvers = require('./resolvers'); // Ensure the correct path to your resolvers

const app = express();

// Middleware and other setups
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(isAuth); // Use authentication middleware

// Disable caching for development
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Connect to MongoDB
connectDB();

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    isAuth: req.isAuth,
    userId: req.userId,
  }),
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Example route
  app.get('/', (req, res) => {
    res.send('API Running');
  });

  // Define port and start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
    console.log(`GraphQL endpoint: ${server.graphqlPath}`);
  });
}

startServer();

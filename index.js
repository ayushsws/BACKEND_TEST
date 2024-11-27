const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
require('dotenv').config();

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const authenticate = require('./authenticate');

const startServer = async () => {
    const app = express();

    // Apply CORS middleware to allow all origins
    app.use(cors());

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => console.log('MongoDB connected'))
      .catch((err) => console.error(err));

    // Create Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }) => {
            const userId = authenticate(req);
            return { userId };
        },
    });

    await server.start();
    server.applyMiddleware({ app });

    // Start the server
    app.listen(process.env.PORT, () => {
        console.log(`Server running at http://localhost:${process.env.PORT}${server.graphqlPath}`);
    });
};

startServer();

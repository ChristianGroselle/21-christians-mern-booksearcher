const express = require("express");
const path = require("path");
const db = require("./config/connection");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

const server = new ApolloServer({ typeDefs, resolvers });

const httpServer = require("http").createServer(app);

server.applyMiddleware({ app });

db.once("open", () => {
  httpServer.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    console.log(
      `GraphQL server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
});

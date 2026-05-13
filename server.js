const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { connectDB } = require("./db/index");
const { authenticate } = require("./middleware/auth");

connectDB();
const app = express();

app.use(authenticate);

app.use(
  "/graphql",
  graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { verifiedUser: req.verifiedUser }, // ← lee el req de cada petición
  })),
);

app.listen(3000);
console.log("Server is running on port 3000");

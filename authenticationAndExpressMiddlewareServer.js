var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    ip: String
  }
`);

const loggingMiddleware = (req, res, next) => {
    console.log('ip:', req.ip);
    next();
}

var root = {
    ip: function (args, request) {

        return request.ip;
    }
};

var app = express();
app.use(loggingMiddleware);
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4001, () => {
    console.log('Running a GraphQL API server at http://localhost:4001/graphql');
});

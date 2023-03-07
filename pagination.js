var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios')

var schema = buildSchema(`
  type Query {
  posts(page: Int!, pageSize: Int!): [Post!]!
 }
  type Post {
  id: ID!
  title: String!
  content: String!
}
`);
const posts = [
    { id: '1', title: 'Post 1', content: 'Content 1' },
    { id: '2', title: 'Post 2', content: 'Content 2' },
    { id: '3', title: 'Post 3', content: 'Content 3' },
    { id: '4', title: 'Post 4', content: 'Content 4' },
    { id: '5', title: 'Post 5', content: 'Content 5' },
    { id: '6', title: 'Post 6', content: 'Content 6' },
    { id: '7', title: 'Post 7', content: 'Content 7' },
    { id: '8', title: 'Post 8', content: 'Content 8' },
    { id: '9', title: 'Post 9', content: 'Content 9' },
    { id: '10', title: 'Post 10', content: 'Content 10' }
];

const loggingMiddleware = (req, res, next) => {
    // console.log('ip:', req.ip, req);
    next();
}

var root = {
    posts: ({ page, pageSize }) => {
        console.log('@@@@', page, pageSize)
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return posts.slice(start, end);
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

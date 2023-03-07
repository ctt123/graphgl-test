var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios')

var schema = buildSchema(`
 type Query {
  users(first: Int, after: String): UserConnection!
}
type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge!]!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}

type User {
id: String,
title: String,
content: String
}

type UserEdge {
  cursor: String!
  node: User!
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

const usersResolver = async (parent, args, context, info) => {
    console.log('@@@@', parent, args, context,info)
    const { first, after } = args;

    // 从数据库中检索所有用户
    const allUsers = posts;

    // 如果有“after”游标，则仅返回大于游标的项目
    const startIndex = after ? allUsers.findIndex(user => user.id === after) + 1 : 0;
    const users = allUsers.slice(startIndex, startIndex + first);

    // 为每个用户创建一个“edge”对象
    const edges = users.map(user => ({
        cursor: user.id,
        node: user,
    }));

    // 确定是否有更多页面
    const hasNextPage = startIndex + first < allUsers.length;

    // 返回查询结果和分页信息
    return {
        pageInfo: {
            hasNextPage,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        },
        edges,
    };
};


var root = {
    // users: usersResolver
    users:(props) => {
        console.log('@@params::', props,arguments)
        return [{
            id: '1'
        }]
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4001, () => {
    console.log('Running a GraphQL API server at http://localhost:4001/graphql');
});

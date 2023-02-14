var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
// rollDice is passing arguments
var schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
    rollDice(numDice: Int!, numSides: Int): [Int]
    name: String
   }
`);

// The root provides a resolver function for each API endpoint
var root = {
    quoteOfTheDay: () => {
        return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
    },
    random: () => {
        return Math.random();
    },
    rollThreeDice: () => {
        return [1, 2, 3].map(_ => 1 + Math.floor(Math.random() * 6));
    },
    rollDice: ({numDice, numSides}) => { // 注意此时的参数是一个对象， 但是写GraphQL query 和schema 里面定义的括号里面都是参数形式写的
        var output = [];
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    name: ()=>{
        return 'ChenXiaoba'
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
}));


app.listen(4001);
console.log('Running a GraphQL API server at http://localhost:4001/graphql');

// todo 在前端就可以通过这样调用该接口
//
// fetch('/graphql', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
//     body: JSON.stringify({query: "{ quoteOfTheDay }"})
// })
//     .then(r => r.json())
//     .then(data => console.log('data returned:', data));


// var dice = 3;
// var sides = 6;
// var query = `query RollDice($dice: Int!, $sides: Int) { // 这是定义的query行为
//   rollDice(numDice: $dice, numSides: $sides)
// }`;
//
// fetch('/graphql', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
//     body: JSON.stringify({
//         query,  // query行为
//         variables: { dice, sides }, // 参数
//     })
// })
//     .then(r => r.json())
//     .then(data => console.log('data returned:', data));



// Basic Types
// 构建schema的数据类型：String, Int, Float, Boolean, ID

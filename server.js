var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
const axios = require('axios')

var schema = buildSchema(`
  type Query {
   name: String
   age: String
   profile: Profile
   customProfile: CustomProfile
  }
  type Profile {
    avatar: String
    avatar_url: String
    create_time: Int
    email: String
    has_homepage: Boolean
    is_homepage_display: Boolean
    mobile: String
    name:String
    password_set: Boolean
    reg_status: Int
    uid: String
    union_id: String
    user_id: Int
    username_changed: Boolean
    wechat: Boolean
  }
  type CustomProfile {
    avatar: String
    avatarUrl: String
    createTime: Int
    email: String
    hasHomepage: Boolean
    isHomepageDisplay: Boolean
    mobile: String
    name:String
    passwordSet: Boolean
    regStatus: Int
    uid: String
    unionId: String
    userId: Int
    usernameChanged: Boolean
    wechat: Boolean
  }
`);

const loggingMiddleware = (req, res, next) => {
    // console.log('ip:', req.ip, req);
    next();
}

var root = {
    name: function () {
        return  'lily'
    },
    age: function(){
        return 12
    },
    profile: async () => {
       const result = await axios
            .get('http://localhost:4000/evercad/v2/user/profile',{
                headers: { // todo 这个权限应该需要上面middleware处理
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMTI2LCJuYW1lIjoi5LiD5LiD5YWr5LiD5Lmd5LiD6Zu25LiD5LiA5LiD5LqM5LiDIiwiZXhwIjoxNjc3NDg3OTc4fQ.V69shJ4WhwJZizyYD9Q7leO7bKpqBF6-PpS6ZqoC89c'
                }
            })
            .then(res => {
                return res.data.data;
            })
            .catch(error => {
                console.error('1error:::',error)
            })
        return result;

    },
    customProfile: async () => {
        const result = await axios
            .get('http://localhost:4000/evercad/v2/user/profile',{
                headers: { // todo 这个权限应该需要上面middleware处理
                    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozMTI2LCJuYW1lIjoi5LiD5LiD5YWr5LiD5Lmd5LiD6Zu25LiD5LiA5LiD5LqM5LiDIiwiZXhwIjoxNjc3NDg3OTc4fQ.V69shJ4WhwJZizyYD9Q7leO7bKpqBF6-PpS6ZqoC89c'
                }
            })
            .then(res => {
                console.log('res::', res)
                return res.data.data;
            })
            .catch(error => {
                console.error('error:::',error)
            })
        console.log('result::', result)
        return {
            avatar: result.avatar,
            avatarUrl: result.avatar_url,
            createTime: result.create_time,
            email: result.email,
            hasHomepage: result.has_homepage,
            isHomepageDisplay: result.is_homepage_display,
            mobile: result.mobile,
            name:result.name,
            passwordSet: result.password_set,
            regStatus: result.reg_status,
            uid: result.uid,
            unionId: result.union_id,
            userId: result.user_id,
            usernameChanged: result.username_changed,
            wechat: result.wechat,
        };
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

const _ = require('lodash');
const {
  GraphQLServer
} = require('graphql-yoga');


const posts = [{
  id: 1,
  title: "this is dummy post1",
  body: "This is dummy body1",
  published: true
}, {
  id: 2,
  title: "this is dummy post2",
  body: "This is dummy body2",
  published: false
}, {
  id: 3,
  title: "this is dummy post3",
  body: "This is dummy body3",
  published: true
}];

const users = [{
  id: 1,
  name: 'Andrew',
  email: 'andrew@yahoo.com',
  age: 28
}, {
  id: 2,
  name: 'Sarah',
  email: 'sarah@yahoo.com',
}, {
  id: 1,
  name: 'Mike',
  email: 'mike@hotmail.com',
}, ]

// type definitions (schema)
const typeDefs = `
  type Query {
    me: User
    post: Post
    users(query: String): [User!]!
    posts(postQuery: String): [Post!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
  }
`

// Resolvers
const resolvers = {
  Query: {
    me() {
      return {
        id: 'abc123',
        name: 'john',
        email: 'j@j.com'
      }
    },
    post() {
      return {
        id: 'asdf123',
        title: 'demo post',
        body: 'Very nice post and course',
        published: false
      }
    },
    users(parent, args) {
      if (!args.query) {
        return users
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      })
    },
    posts(parent, args){
      if(!args.postQuery) {
        return posts;
      }

      return posts.filter((post) => {
        return post.title.toLocaleLowerCase().includes(args.postQuery) || post.body.toLocaleLowerCase().includes(args.postQuery)
      })
      
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log(`server is up!`);
})
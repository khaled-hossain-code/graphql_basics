const _ = require('lodash');
const {
  GraphQLServer
} = require('graphql-yoga');
const uuidV4 = require('uuid/v4');


const posts = [{
  id: 1,
  title: "this is dummy post1",
  body: "This is dummy body1",
  published: true,
  author: 1
}, {
  id: 2,
  title: "this is dummy post2",
  body: "This is dummy body2",
  published: false,
  author: 2
}, {
  id: 3,
  title: "this is dummy post3",
  body: "This is dummy body3",
  published: true,
  author: 3
}];

const comments = [{
  id: 1,
  text: 'this is comment1',
  author: 1,
  post: 1
},{
  id: 2,
  text: 'this is comment2',
  author: 1,
  post: 1
},{
  id: 3,
  text: 'this is comment3',
  author: 2,
  post: 2
},{
  id: 4,
  text: 'this is comment4',
  author: 3,
  post: 3
},]

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
  id: 3,
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
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!,
    text: String!,
    author: User!,
    post: Post!
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
    posts(parent, args) {
      if (!args.postQuery) {
        return posts;
      }

      return posts.filter((post) => {
        return post.title.toLocaleLowerCase().includes(args.postQuery) || post.body.toLocaleLowerCase().includes(args.postQuery)
      })
    },
    comments(parent, args) {
      return comments
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info){
      const isEmailTaken = users.some((user) => user.email === args.email)

      if(isEmailTaken) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuidV4(),
        name: args.name,
        email: args.email,
        age: args.age
      };

      users.push(user);

      return user
    },
    createPost(parent, args, ctx, info){
      const isUserExists = users.some((user) => user.id === args.author)

      if(!isUserExists){
        throw new Error('User does not exist')
      }

      const newPost = {
        id: uuidV4(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      }

      posts.push(newPost);

      return newPost;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find( (user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter( (comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter( (post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter( (comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find( (user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
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
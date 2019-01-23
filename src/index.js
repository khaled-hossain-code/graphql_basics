const _ = require('lodash');
const {
  GraphQLServer
} = require('graphql-yoga');
const uuidV4 = require('uuid/v4');


let posts = [{
  id: '1',
  title: "this is dummy post1",
  body: "This is dummy body1",
  published: true,
  author: '1'
}, {
  id: '2',
  title: "this is dummy post2",
  body: "This is dummy body2",
  published: false,
  author: '2'
}, {
  id: '3',
  title: "this is dummy post3",
  body: "This is dummy body3",
  published: true,
  author: '3'
}];

let comments = [{
  id: '1',
  text: 'this is comment1',
  author: '1',
  post: '1'
}, {
  id: '2',
  text: 'this is comment2',
  author: '1',
  post: '1'
}, {
  id: '3',
  text: 'this is comment3',
  author: '2',
  post: '2'
}, {
  id: '4',
  text: 'this is comment4',
  author: '3',
  post: '3'
}, ]

let users = [{
  id: '1',
  name: 'Andrew',
  email: 'andrew@yahoo.com',
  age: 28
}, {
  id: '2',
  name: 'Sarah',
  email: 'sarah@yahoo.com',
}, {
  id: '3',
  name: 'Mike',
  email: 'mike@hotmail.com',
}, ]

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
    createUser(parent, args, ctx, info) {
      const isEmailTaken = users.some((user) => user.email === args.data.email)

      if (isEmailTaken) {
        throw new Error('Email taken.')
      }

      const user = {
        id: uuidV4(),
        ...args.data
      };

      users.push(user);

      return user
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if(userIndex === -1){
        throw new Error('User not found')
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id

        if(match){
          comments = comments.filter(comment => comment.post !== post.id)
        }

        return !match;
      });

      comments = comments.filter( comment => comment.author !== args.id)

      return deletedUsers[0]
    },
    createPost(parent, args, ctx, info) {
      const isUserExists = users.some((user) => user.id === args.data.author)

      if (!isUserExists) {
        throw new Error('User does not exist')
      }

      const newPost = {
        id: uuidV4(),
        ...args.data
      }

      posts.push(newPost);

      return newPost;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)

      if(postIndex === -1) {
        throw new Error('Post does not exist')
      }

      const deletedPosts = posts.splice(postIndex, 1);
      comments = comments.filter(comment => comment.post !== args.id)

      return deletedPosts[0]
    },
    createComment(parent, args, ctx, info) {
      const isUserExists = users.some((user) => user.id === args.data.author)
      const isPostExists = posts.some((post) => post.id === args.data.post && post.published === true)

      if (!isUserExists) {
        throw new Error('User does not exist')
      }

      if (!isPostExists) {
        throw new Error('Post does not exist')
      }

      const newComment = {
        id: uuidV4(),
        ...args.data
      }

      comments.push(newComment);

      return newComment;
    },
    deleteComment(parent, args, ctx, info){
      const commentIndex = comments.findIndex(comment => comment.id === args.id)

      if(commentIndex === -1){
        throw new Error('comment not found')
      }

      const deletedComments = comments.splice(commentIndex, 1);

      return deletedComments[0];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
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
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(() => {
  console.log(`server is up!`);
})
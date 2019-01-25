const _ = require('lodash');
const {
  GraphQLServer, PubSub
} = require('graphql-yoga');
const db = require('./db');
const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const Subscription = require('./resolvers/Subscription');
const Post = require('./resolvers/Post');
const User = require('./resolvers/User');
const Comment = require('./resolvers/Comment');

// Resolvers
const resolvers = {
  Query,
  Mutation,
  Subscription,
  Post,
  User,
  Comment
}

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    db,
    pubsub
  }
});

server.start(() => {
  console.log(`server is up!`);
})
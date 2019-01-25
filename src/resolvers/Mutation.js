const uuidV4 = require('uuid/v4');

const Mutation = {
  createUser(parent, args, {
    db
  }, info) {
    const isEmailTaken = db.users.some((user) => user.email === args.data.email)

    if (isEmailTaken) {
      throw new Error('Email taken.')
    }

    const user = {
      id: uuidV4(),
      ...args.data
    };

    db.users.push(user);

    return user
  },
  deleteUser(parent, args, {
    db
  }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    if (userIndex === -1) {
      throw new Error('User not found')
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id

      if (match) {
        comments = db.comments.filter(comment => comment.post !== post.id)
      }

      return !match;
    });

    db.comments = db.comments.filter(comment => comment.author !== args.id)

    return deletedUsers[0]
  },
  updateUser(parent, args, {
    db
  }, info) {
    const {
      id,
      data
    } = args;
    const user = db.users.find(user => user.id === args.id)

    if (!user) {
      throw new Error('User not found')
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some(user => user.email === data.email)

      if (emailTaken) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }

    if (typeof data.name === 'string') {
      user.name = data.name
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age
    }

    return user;
  },
  createPost(parent, args, {
    db,
    pubsub
  }, info) {
    const isUserExists = db.users.some((user) => user.id === args.data.author)

    if (!isUserExists) {
      throw new Error('User does not exist')
    }

    const newPost = {
      id: uuidV4(),
      ...args.data
    }

    db.posts.push(newPost);

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: newPost
        }
      })
    }
    return newPost;
  },
  updatePost(parent, args, {
    db,
    pubsub
  }, info) {
    const {
      id,
      data
    } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post
    };

    if (!post) {
      throw new Error('Post not found')
    }

    if (typeof data.title === 'string') {
      post.title = data.title
    }

    if (typeof data.body === 'string') {
      post.body = data.body
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      }

      if (!originalPost.published && post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, args, {
    db,
    pubsub
  }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id)

    if (postIndex === -1) {
      throw new Error('Post does not exist')
    }

    const [deletedPost] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== args.id)

    if (deletedPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: deletedPost
        }
      })
    }

    return deletedPost
  },
  createComment(parent, args, {
    db,
    pubsub
  }, info) {
    const isUserExists = db.users.some((user) => user.id === args.data.author)
    const isPostExists = db.posts.some((post) => post.id === args.data.post && post.published === true)

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

    db.comments.push(newComment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: newComment
      }
    })

    return newComment;
  },
  updateComment(parent, args, {
    db,
    pubsub
  }, info) {
    const {
      id,
      data
    } = args;

    const comment = db.comments.find(comment => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (typeof data.text === 'string') {
      comment.text = data.text
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })
    return comment;
  },
  deleteComment(parent, args, {
    db,
    pubsub
  }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id)

    if (commentIndex === -1) {
      throw new Error('comment not found')
    }

    const [deletedComment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: 'DELETE',
        data: deletedComment
      }
    })

    return deletedComment;
  }
};

module.exports = Mutation;
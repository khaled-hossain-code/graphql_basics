const Query = {
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
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users
    }

    return db.users.filter((user) => {
      return user.name.toLowerCase().includes(args.query.toLowerCase());
    })
  },
  posts(parent, args, {db}, info) {
    if (!args.postQuery) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      return post.title.toLocaleLowerCase().includes(args.postQuery) || post.body.toLocaleLowerCase().includes(args.postQuery)
    })
  },
  comments(parent, args, {db}, info) {
    return db.comments
  }
};

module.exports = Query;

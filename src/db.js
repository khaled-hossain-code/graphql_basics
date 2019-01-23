const posts = [{
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

const comments = [{
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

const users = [{
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

const db = {
  users,
  posts,
  comments
}

module.exports = db;
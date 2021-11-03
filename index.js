require('dotenv').config();
const util = require('util')
const DataService = require('./DataService');

start();

async function start() {
  const preprocessedData = await preprocessData();
  console.log(util.inspect(preprocessedData, false, null, true));
};

async function preprocessData() {
  let users = await DataService.getData('users');
  let posts = await DataService.getData('posts', 100);

  posts = posts.map(post => {
    const currentPost = {
      ...post,
      title_crop: post.title.substr(0, 20) + '...'
    };
    return currentPost;
  });

  users = users.map(user => {
    return {
      ...user,
      address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
      website: `https://${user.website}`,
      company: user.company.name,
      posts: posts.filter(post => post.userId === user.id)
    }
  });

  const user2 = users.find(user => user.id === 2);

  const user2PostsCommentsPromisses = [];

  user2.posts.forEach(post => {
    user2PostsCommentsPromisses.push(DataService.getData(`posts/${post.id}/comments`));
  });

  const user2PostsCommentsResults = await Promise.all(user2PostsCommentsPromisses);

  user2.posts = user2.posts.map((post, i) => {
    return {
      ...post,
      comments: user2PostsCommentsResults[i]
    }
  });

  return users;
}
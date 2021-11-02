require('dotenv').config();
const util = require('util')
const Axios = require('axios');
const apiUrl = process.env.APP_API_URL || `http://jsonplaceholder.typicode.com`

start();

async function start() {
  const preprocessedData = await preprocessData();
  setTimeout(() => {
    console.log(util.inspect(preprocessedData, false, null, true));
  }, 1500)
};

async function preprocessData() {
  let users = await getData('users');
  let posts = await getData('posts', 100);

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

  let user2 = users.find(user => user.id === 2);

  user2.posts = user2.posts.map(post => {
    
    const postComments = (async function() {
      return await getPostComments(post.id)
    })();

    return {
      ...post,
      comments: postComments
    }
  });

  return users;
}

async function getData(endpoint, limit = 10) {
  try {
    const response = await Axios.get(`${apiUrl}/${endpoint}`, {
      params: {
        _limit: limit
      }
    });
    return response.data;
  }
  catch (e) {
    console.log(e);
    return [];
  }
}

async function getPostComments(postId) {
  return await getData(`posts/${postId}/comments`);
}
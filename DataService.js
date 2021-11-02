const Axios = require('axios');

class DataService {
  constructor() {
    this.baseUrl = process.env.APP_API_URL || `http://jsonplaceholder.typicode.com`;
  }

  async getData(endpoint, limit = 10) {
    try {
      const response = await Axios.get(`${this.baseUrl}/${endpoint}`, {
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
}

module.exports = new DataService();
const api = require("axios");

const Query = {
  getFirstItem: async () => {
    try {
      const res = await api.get(
        "https://hacker-news.firebaseio.com/v0/topstories.json"
      );

      const [topId] = res.data;

      const item = await api.get(
        `https://hacker-news.firebaseio.com/v0/item/${topId}.json`
      );

      const { title, url } = item.data;

      return { title, url };
    } catch (e) {
      return e;
    }
  },
};

const Mutation = {};

module.exports = { Query, Mutation };

export default {
  routes: [
    {
      method: "POST",
      path: "/articles/:id/increment",
      handler: "article.incrementView",
    },
    {
      method: "GET",
      path: "/articles/trending",
      handler: "api::article.trending.trending",
      config: {
        auth: false,
      },
    },
  ],
};

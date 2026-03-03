export default {
  async trending(ctx) {
    const { period } = ctx.query;
    const knex = strapi.db.connection;

    let interval = "1 day";
    if (period === "7d") {
      interval = "7 days";
    }

    const results = await knex("articles as a")
      .leftJoin("article_views as av", "a.id", "av.article_id")
      .select("a.id", "a.title", "a.slug", knex.raw("COUNT(av.id) as views"))
      .where("av.created_at", ">=", knex.raw(`NOW() - INTERVAL '${interval}'`))
      .groupBy("a.id")
      .orderBy("views", "desc")
      .limit(5);

    ctx.body = results;
  },
};

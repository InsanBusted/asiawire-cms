import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::article.article", ({ strapi }) => ({
  async incrementView(ctx) {
    const id = Number(ctx.params.id);
    strapi.log.info(`incrementView HIT id=${id}`);

    // 1) Cari article by numeric id (db.query mendukung where id)
    const article = await strapi.db.query("api::article.article").findOne({
      where: { id },
      select: ["id", "documentId", "views"],
    });

    strapi.log.info(`artikelnya: ${JSON.stringify(article, null, 2)}`);

    if (!article) return ctx.notFound("Article not found");

    // 2) Update views pakai documents.update (pakai documentId)
    await strapi.documents("api::article.article").update({
      documentId: article.documentId,
      data: { views: (article.views ?? 0) + 1 },
    });

    // 3) Create log view
    // Kalau field relation "article" di article-view itu relation ke Article,
    // biasanya cukup isi dengan documentId (tanpa connect).
    await strapi.documents("api::article-view.article-view").create({
      data: {
        article: article.documentId,
      },
    });

    return ctx.send({ success: true });
  },
}));
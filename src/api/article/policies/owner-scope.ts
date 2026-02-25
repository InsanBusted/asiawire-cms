export default async (ctx, _config, { strapi }) => {
  const user = ctx.state.user;
  if (!user) return false;

  const method = ctx.request.method;

  // =========================
  // 1️⃣ LIST (GET /articles)
  // =========================
  if (method === 'GET' && !ctx.params?.id && !ctx.params?.documentId) {
    ctx.query = ctx.query || {};
    ctx.query.filters = {
      ...(ctx.query.filters || {}),
      users_permissions_user: {
        id: user.id,
      },
    };

    return true;
  }

  // ==================================
  // 2️⃣ DETAIL / UPDATE / DELETE
  // ==================================
  if (['GET', 'PUT', 'DELETE'].includes(method)) {
    const documentId = ctx.params?.documentId || ctx.params?.id;
    if (!documentId) return false;

    const entry = await strapi.db.query('api::article.article').findOne({
      where: { documentId },
      populate: { users_permissions_user: true },
    });

    if (!entry) return false;

    const ownerId =
      typeof entry.users_permissions_user === 'object'
        ? entry.users_permissions_user?.id
        : entry.users_permissions_user;

    return ownerId === user.id;
  }

  return true;
};
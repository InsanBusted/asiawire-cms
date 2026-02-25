export default {
  async beforeCreate(event) {
    const user = event.state?.user;
    if (!user) return;

    event.params.data.users_permissions_user = user.id;
  },

  async beforeUpdate(event) {
    if (event.params.data?.users_permissions_user) {
      delete event.params.data.users_permissions_user;
    }
  },
};
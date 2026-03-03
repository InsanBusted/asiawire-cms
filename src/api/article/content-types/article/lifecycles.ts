import { errors } from "@strapi/utils";

const { ValidationError } = errors;

export default {
  async beforeCreate(event) {
    const { data } = event.params;

    if (!data.sub_category) {
      throw new ValidationError("Sub Category is required");
    }
  },

  async beforeUpdate(event) {
    const { data } = event.params;

    if (data.sub_category === null) {
      throw new ValidationError("Sub Category is required");
    }
  },
};
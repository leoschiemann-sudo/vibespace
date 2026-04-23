import { defineType, defineField } from "sanity";

export const editorSettingsSchema = defineType({
  name: "editorSettings",
  title: "Editor Settings",
  type: "document",
  fields: [
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      description: "The Argon2id hash of the editor password",
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      description: "When the password was last updated",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Editor Settings",
      };
    },
  },
});

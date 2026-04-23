import { defineType, defineField } from "sanity";

export const profileSchema = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
    }),
    defineField({
      name: "avatarUrl",
      title: "Avatar URL",
      type: "url",
    }),
    defineField({
      name: "mood",
      title: "Mood",
      type: "object",
      fields: [
        { name: "emoji", title: "Emoji", type: "string" },
        { name: "text", title: "Text", type: "string" },
      ],
    }),
    defineField({
      name: "spotifyUrl",
      title: "Spotify URL",
      type: "url",
    }),
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
        },
      ],
    }),
    defineField({
      name: "passwordHash",
      title: "Password Hash",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "ownerId",
      title: "Owner ID",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      readOnly: true,
    }),
  ],
});

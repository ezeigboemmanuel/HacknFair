import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeFair = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("fairs", {
      title: args.title,
      subtitle: args.subtitle,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const fair = await ctx.db.query("fairs").collect();

    return fair;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

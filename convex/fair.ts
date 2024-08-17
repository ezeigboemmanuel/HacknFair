import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeFair = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    deadline: v.string(),
    about: v.string(),
    requirements: v.string(),
    prices: v.string(),
    judgingCriteria: v.string(),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    format: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user === null) {
      return;
    }
    await ctx.db.insert("fairs", {
      title: args.title,
      subtitle: args.subtitle,
      deadline: args.deadline,
      about: args.about,
      requirements: args.requirements,
      prices: args.prices,
      judgingCriteria: args.judgingCriteria,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
      judgeId: user._id,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const fairs = await ctx.db.query("fairs").collect();

    const fairsWithImages = await Promise.all(
      // get images

      await Promise.all(
        fairs.map(async (fair) => {
          const imageUrl = await ctx.storage.getUrl(fair.storageId);
          if (!imageUrl) {
            throw new Error("Image not found");
          }
          return { ...fair, imageUrl: imageUrl };
        })
      )
    );
    return fairsWithImages;
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// export const getImageUrl = query({
//   args: { storageId: v.optional(v.id("_storage")) },
//   handler: async (ctx, args) => {
//     if (!args.storageId) return null;
//     return await ctx.storage.getUrl(args.storageId);
//   },
// });

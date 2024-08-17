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
    const fairs = await ctx.db.query("fairs").order("desc").collect();

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

export const getSingleFair = query({
  args: { id: v.id("fairs") },
  handler: async (ctx, args) => {
    const fair = await ctx.db.get(args.id);

    if (fair === null) {
      throw new Error("Fair not found");
    }

    const singleFair = await ctx.db
      .query("fairs")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect()
      
      const singleFairWithImage = await Promise.all(
        // get images
  
        await Promise.all(
          singleFair.map(async (item) => {
            const imageUrl = await ctx.storage.getUrl(item.storageId);
            if (!imageUrl) {
              throw new Error("Image not found");
            }
            return { ...fair, imageUrl: imageUrl };
          })
        )
      );
      return singleFairWithImage;
    return singleFairWithImage;
  },
});
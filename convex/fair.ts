import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const storeFair = mutation({
  args: {
    title: v.string(),
    subtitle: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("fairs", {
      title: args.title,
      subtitle: args.subtitle,
      imageUrl: args.imageUrl,
    });
  },
});

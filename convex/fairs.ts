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

    const fairs = await ctx.db.query("fairs").order("desc").collect();

    const fairsWithImages = await Promise.all(
      fairs.map(async (fair) => {
        const imageUrl = await ctx.storage.getUrl(fair.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...fair, imageUrl: imageUrl };
      })
    );
    return fairsWithImages;
  },
});

export const getSearch = query({
  args: { search: v.string() },
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
    const title = args.search as string;

    let fairs = [];

    if (title) {
      fairs = await ctx.db
        .query("fairs")
        .withSearchIndex("search_title", (q) => q.search("title", title))
        .collect();
    } else {
      fairs = await ctx.db.query("fairs").order("desc").collect();
    }
    const fairsWithImages = await Promise.all(
      fairs.map(async (fair) => {
        const imageUrl = await ctx.storage.getUrl(fair.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...fair, imageUrl: imageUrl };
      })
    );
    return fairsWithImages;
  },
});

export const getFairsByUser = query({
  args: { id: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const fairs = await ctx.db
      .query("fairs")
      .filter((q) => q.eq(q.field("judgeId"), args.id))
      .order("desc")
      .collect();

    const fairsWithImages = await Promise.all(
      fairs.map(async (fair) => {
        const imageUrl = await ctx.storage.getUrl(fair.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...fair, imageUrl: imageUrl };
      })
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

    const judge = await ctx.db.get(fair.judgeId);

    const singleFair = await ctx.db
      .query("fairs")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();

    const singleFairWithImage = await Promise.all(
      singleFair.map(async (item) => {
        const imageUrl = await ctx.storage.getUrl(item.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...fair, judge: judge, imageUrl: imageUrl };
      })
    );

    return singleFairWithImage;
  },
});

export const getSingleFairForJudge = query({
  args: { id: v.id("fairs"), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const fair = await ctx.db.get(args.id);

    if (fair === null) {
      throw new Error("Fair not found");
    }

    const singleFair = await ctx.db
      .query("fairs")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();

    if (singleFair.map((item) => item.judgeId)[0] !== args.userId) {
      throw new Error("Unauthorised");
    }

    const singleFairWithImage = await Promise.all(
      singleFair.map(async (item) => {
        const imageUrl = await ctx.storage.getUrl(item.storageId);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...fair, imageUrl: imageUrl };
      })
    );

    return singleFairWithImage;
  },
});

export const updateFair = mutation({
  args: {
    id: v.id("fairs"),
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

    const title = args.title.trim();
    const subtitle = args.subtitle.trim();
    const about = args.about.trim();
    const requirements = args.requirements.trim();
    const prices = args.prices.trim();
    const judgingCriteria = args.judgingCriteria.trim();

    if (!title || !subtitle || !about) {
      throw new Error("You must fill the required fields");
    }

    const newfair = ctx.db.patch(args.id, {
      title: args.title,
      subtitle: args.subtitle,
      deadline: args.deadline,
      about: args.about,
      requirements: args.requirements,
      prices: args.prices,
      judgingCriteria: args.judgingCriteria,
      format: args.format,
      storageId: args.storageId,
      imageUrl: args.imageUrl,
    });

    return newfair;
  },
});

export const deleteFair = mutation({
  args: { id: v.id("fairs") },
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

    // Find all submissions associated with this fair
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_fairId", (q) => q.eq("fairId", args.id))
      .collect();

    // Delete each submission
    for (const submission of submissions) {
      await ctx.db.delete(submission._id);
    }

    await ctx.db.delete(args.id);
  },
});

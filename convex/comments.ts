import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeComments = mutation({
  args: {
    userId: v.id("users"),
    submissionId: v.id("submissions"),
    comment: v.string(),
    createdAt: v.string(),
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

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    //   if (!submission.comments) {
    //     submission.comments = [];
    //   }
    await ctx.db.insert("comments", {
      userId: args.userId,
      submissionId: args.submissionId,
      comment: args.comment,
      createdAt: args.createdAt,
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

    const comments = await ctx.db.query("comments").order("desc").collect();
    const commentWithCreator = await Promise.all(
      comments.map(async (comment) => {
        const commentCreator = await ctx.db.get(comment.userId);
        return { ...comment, commentCreator };
      })
    );

    return commentWithCreator;
  },
});

export const updateComment = mutation({
  args: {
    id: v.optional(v.id("comments")),
    userId: v.id("users"),
    submissionId: v.id("submissions"),
    comment: v.string(),
    createdAt: v.string(),
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

    if (!args.id) {
      return;
    }

    await ctx.db.patch(args.id, {
      userId: args.userId,
      comment: args.comment,
      createdAt: args.createdAt,
      submissionId: args.submissionId,
    });
  },
});

export const deleteComment = mutation({
  args: { id: v.id("comments") },
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

    await ctx.db.delete(args.id);
  },
});

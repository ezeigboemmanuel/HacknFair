import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const storeSubmission = mutation({
  args: {
    title: v.string(),
    email: v.string(),
    about: v.string(),
    userId: v.id("users"),
    fairId: v.id("fairs"),
    imageUrl: v.string(),
    storageId: v.array(v.id("_storage")),
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

    if (args.storageId.length > 5) {
      throw new Error(
        "You can upload up to 5 media files. Please delete a media file before uploading a new one."
      );
    }

    await ctx.db.insert("submissions", {
      title: args.title,
      email: args.email,
      about: args.about,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
      userId: args.userId,
      fairId: args.fairId,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
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

    const submissions = await ctx.db
      .query("submissions")
      .order("desc")
      .collect();

    const submissionsWithImages = await Promise.all(
      submissions.map(async (item) => {
        const creator = await ctx.db.get(item.userId);
        const imageUrls = await Promise.all(
          item.storageId.map(async (id) => {
            const imageUrl = await ctx.storage.getUrl(id);
            if (!imageUrl) {
              throw new Error("Image not found");
            }
            return imageUrl;
          })
        );
        return { ...item, imageUrls, creator: creator };
      })
    );

    return submissionsWithImages;
  },
});

export const getSubmissionsByUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();

    const submissionsWithImages = await Promise.all(
      submissions.map(async (item) => {
        const creator = await ctx.db.get(item.userId);
        const imageUrls = await Promise.all(
          item.storageId.map(async (id) => {
            const imageUrl = await ctx.storage.getUrl(id);
            if (!imageUrl) {
              throw new Error("Image not found");
            }
            return imageUrl;
          })
        );
        return { ...item, imageUrls, creator: creator };
      })
    );

    return submissionsWithImages;
  },
});

export const getSingleSubmission = query({
  args: { id: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);
    if (submission === null) {
      throw new Error("Submission not found");
    }

    const creator = await ctx.db.get(submission.userId);

    const singleSubmission = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();

    const singleSubmissionWithImage = await Promise.all(
      singleSubmission.map(async (item) => {
        const imageUrls = await Promise.all(
          item.storageId.map(async (id) => {
            const imageUrl = await ctx.storage.getUrl(id);
            if (!imageUrl) {
              throw new Error("Image not found");
            }
            return imageUrl;
          })
        );
        return { ...item, imageUrls, creator };
      })
    );

    return singleSubmissionWithImage;
  },
});

export const getSubmissionsByFair = query({
  args: { id: v.id("fairs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }

    const submissions = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("fairId"), args.id))
      .order("desc")
      .collect();

    const submissionsWithImage = await Promise.all(
      submissions.map(async (submission) => {
        const imageUrl = await ctx.storage.getUrl(submission.storageId[0]);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...submission, imageUrl: imageUrl };
      })
    );
    return submissionsWithImage;
  },
});

export const getSingleSubmissionByUser = query({
  args: { id: v.id("submissions"), userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.id);

    if (submission === null) {
      throw new Error("Fair not found");
    }

    const singleFair = await ctx.db
      .query("submissions")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .collect();

    if (singleFair.map((item) => item.userId)[0] !== args.userId) {
      throw new Error("Unauthorised");
    }

    const singleFairWithImage = await Promise.all(
      singleFair.map(async (item) => {
        const imageUrl = await ctx.storage.getUrl(item.storageId[0]);
        if (!imageUrl) {
          throw new Error("Image not found");
        }
        return { ...submission, imageUrl: imageUrl };
      })
    );

    return singleFairWithImage;
  },
});

export const updateSubmission = mutation({
  args: {
    id: v.id("submissions"),
    title: v.string(),
    email: v.string(),
    about: v.string(),
    userId: v.id("users"),
    fairId: v.id("fairs"),
    imageUrl: v.string(),
    storageId: v.array(v.id("_storage")),
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

    if (args.storageId.length > 5) {
      throw new Error(
        "You can upload up to 5 media files. Please delete a media file before uploading a new one."
      );
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      email: args.email,
      about: args.about,
      imageUrl: args.imageUrl,
      storageId: args.storageId,
      format: args.format,
      userId: args.userId,
      fairId: args.fairId,
    });
  },
});

export const deleteSubmission = mutation({
  args: { id: v.id("submissions") },
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

        // Find all comments associated with this submission
        const comments = await ctx.db
        .query("comments")
        .withIndex("by_submissionId", (q) => q.eq("submissionId", args.id))
        .collect();
  
      // Delete each submission
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }
    await ctx.db.delete(args.id);
  },
});

// For votes

export const upvoteSubmission = mutation({
  args: { submissionId: v.id("submissions"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);

    if (!submission) {
      throw new Error("Submission not found");
    }

    if (!submission.votes) {
      submission.votes = [];
    }

    if (!submission.upvotes) {
      submission.upvotes = 0;
    }

    if (!submission.downvotes) {
      submission.downvotes = 0;
    }

    const existingVoteIndex = submission.votes?.findIndex(
      (vote) => vote.userId === args.userId
    );
    const existingVote = submission.votes[existingVoteIndex];

    if (existingVote && existingVote.voteType === "upvote") {
      // User already upvoted, remove their vote (toggle off)
      await ctx.db.patch(args.submissionId, {
        upvotes: submission.upvotes - 1,
        votes: submission.votes.filter((vote) => vote.userId !== args.userId),
      });
    } else if (existingVote && existingVote.voteType === "downvote") {
      // User downvoted, switch to upvote
      await ctx.db.patch(args.submissionId, {
        upvotes: submission.upvotes + 1,
        downvotes: submission.downvotes - 1,
        votes: submission.votes.map((vote) =>
          vote.userId === args.userId ? { ...vote, voteType: "upvote" } : vote
        ),
      });
    } else {
      // No previous vote, add upvote
      await ctx.db.patch(args.submissionId, {
        upvotes: submission.upvotes + 1,
        votes: [
          ...submission.votes,
          { userId: args.userId, voteType: "upvote" },
        ],
      });
    }
  },
});

export const downvoteSubmission = mutation({
  args: { submissionId: v.id("submissions"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    if (!submission.votes) {
      submission.votes = [];
    }

    if (!submission.upvotes) {
      submission.upvotes = 0;
    }

    if (!submission.downvotes) {
      submission.downvotes = 0;
    }

    const existingVoteIndex = submission.votes.findIndex(
      (vote) => vote.userId === args.userId
    );
    const existingVote = submission.votes[existingVoteIndex];

    if (existingVote && existingVote.voteType === "downvote") {
      // User already downvoted, remove their vote (toggle off)
      await ctx.db.patch(args.submissionId, {
        downvotes: submission.downvotes - 1,
        votes: submission.votes.filter((vote) => vote.userId !== args.userId),
      });
    } else if (existingVote && existingVote.voteType === "upvote") {
      // User upvoted, switch to downvote
      await ctx.db.patch(args.submissionId, {
        upvotes: submission.upvotes - 1,
        downvotes: submission.downvotes + 1,
        votes: submission.votes.map((vote) =>
          vote.userId === args.userId ? { ...vote, voteType: "downvote" } : vote
        ),
      });
    } else {
      // No previous vote, add downvote
      await ctx.db.patch(args.submissionId, {
        downvotes: submission.downvotes + 1,
        votes: [
          ...submission.votes,
          { userId: args.userId, voteType: "downvote" },
        ],
      });
    }
  },
});

export const makeWinner = mutation({
  args: { submissionId: v.id("submissions"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    if (submission.winner) {
      return;
    }

    await ctx.db.patch(args.submissionId, {
      winner: true,
    });
  },
});

export const removeWinner = mutation({
  args: { submissionId: v.id("submissions"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) {
      throw new Error("Submission not found");
    }

    await ctx.db.patch(args.submissionId, {
      winner: false,
    });
  },
});

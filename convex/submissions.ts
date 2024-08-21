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
        return { ...item, imageUrls, creator: creator};
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
        return { ...item, imageUrls, creator};
      })
    );

    return singleSubmissionWithImage;
  },
});


export const getSubmissionsByFair = query({
  args: {id: v.id("fairs")},
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
  }
})

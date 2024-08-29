import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_name", ["name"]),
  fairs: defineTable({
    title: v.string(),
    subtitle: v.string(),
    deadline: v.optional(v.string()),
    about: v.string(),
    requirements: v.optional(v.string()),
    prices: v.optional(v.string()),
    judgingCriteria: v.optional(v.string()),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    format: v.string(),
    judgeId: v.id("users"),
  })
    .searchIndex("search_title", {
      searchField: "title",
    })
    .index("by_subtitle", ["subtitle"]),
  submissions: defineTable({
    title: v.string(),
    email: v.string(),
    about: v.string(),
    imageUrl: v.string(),
    storageId: v.array(v.id("_storage")),
    format: v.string(),
    userId: v.id("users"),
    fairId: v.id("fairs"),
    winner: v.optional(v.boolean()),
    upvotes: v.optional(v.number()),
    downvotes: v.optional(v.number()),
    votes: v.optional(
      v.array(
        v.object({
          userId: v.id("users"),
          voteType: v.string(),
        })
      )
    ),
  }).index("by_title", ["title"]),
  comments: defineTable({
    submissionId: v.id("submissions"),
    userId: v.id("users"),
    comment: v.string(),
    createdAt: v.string(),
  }),
});

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
  .index("by_title", ["title"])
  .index("by_subtitle", ["subtitle"]),
});

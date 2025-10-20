import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    stock: v.number(),
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("discontinued")),
  }).index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_price", ["price"]),
});

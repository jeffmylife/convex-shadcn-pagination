import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { PaginationResult } from "convex/server";

export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    category: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("discontinued"),
      ),
    ),
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("products"),
        _creationTime: v.number(),
        name: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.string(),
        stock: v.number(),
        status: v.union(
          v.literal("active"),
          v.literal("inactive"),
          v.literal("discontinued"),
        ),
      }),
    ),
    isDone: v.boolean(),
    continueCursor: v.string(),
    splitCursor: v.optional(v.union(v.string(), v.null())),
    pageStatus: v.optional(
      v.union(
        v.literal("SplitRecommended"),
        v.literal("SplitRequired"),
        v.null(),
      ),
    ),
  }),
  handler: async (ctx, args) => {
    // Use index if available for better performance
    if (args.status && (!args.category || args.category === "all")) {
      // Only status filter - use index
      return await ctx.db
        .query("products")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (args.category && args.category !== "all" && !args.status) {
      // Only category filter - use index
      return await ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .paginate(args.paginationOpts);
    } else if (args.status && args.category && args.category !== "all") {
      // Both filters - use one index and filter the rest
      const results = await ctx.db
        .query("products")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .paginate(args.paginationOpts);

      return {
        ...results,
        page: results.page.filter(
          (product) => product.category === args.category
        ),
      };
    }

    // No filters - table scan
    return await ctx.db
      .query("products")
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    stock: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("discontinued"),
    ),
  },
  returns: v.id("products"),
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    stock: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("active"),
        v.literal("inactive"),
        v.literal("discontinued"),
      ),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return null;
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return null;
  },
});

export const getCategories = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const categories = new Set(products.map((p) => p.category));
    return Array.from(categories).sort();
  },
});

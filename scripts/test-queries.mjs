#!/usr/bin/env node

// Example script showing how to test Convex queries from the command line
// Run with: node scripts/test-queries.mjs

console.log(`
Example Convex Query Commands
==============================

You can test your Convex queries using the following commands:

1. Seed the database:
   npx convex run seed:seedDatabase

2. List all products (first 10):
   npx convex run products:list '{"paginationOpts": {"numItems": 10, "cursor": null}}'

3. List products by category:
   npx convex run products:list '{"paginationOpts": {"numItems": 10, "cursor": null}, "category": "Electronics"}'

4. List products by status:
   npx convex run products:list '{"paginationOpts": {"numItems": 10, "cursor": null}, "status": "active"}'

5. Get all categories:
   npx convex run products:getCategories

6. Create a new product:
   npx convex run products:create '{"name": "Test Product", "description": "A test product", "price": 99.99, "category": "Electronics", "stock": 10, "status": "active"}'

Note: Make sure your Convex dev server is running (npx convex dev) before running these commands.
`);

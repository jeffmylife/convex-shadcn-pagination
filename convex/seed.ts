import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

const sampleProducts = [
  { name: "Laptop Pro 15", description: "High-performance laptop with 15-inch display", price: 1299.99, category: "Electronics", stock: 25, status: "active" as const },
  { name: "Wireless Mouse", description: "Ergonomic wireless mouse with long battery life", price: 29.99, category: "Electronics", stock: 150, status: "active" as const },
  { name: "Mechanical Keyboard", description: "RGB mechanical keyboard with cherry switches", price: 149.99, category: "Electronics", stock: 45, status: "active" as const },
  { name: "Office Chair", description: "Ergonomic office chair with lumbar support", price: 349.99, category: "Furniture", stock: 30, status: "active" as const },
  { name: "Standing Desk", description: "Adjustable height standing desk", price: 599.99, category: "Furniture", stock: 12, status: "active" as const },
  { name: "Desk Lamp", description: "LED desk lamp with adjustable brightness", price: 49.99, category: "Furniture", stock: 60, status: "active" as const },
  { name: "Coffee Maker", description: "Programmable coffee maker with thermal carafe", price: 89.99, category: "Appliances", stock: 20, status: "active" as const },
  { name: "Microwave Oven", description: "1000W microwave with multiple presets", price: 129.99, category: "Appliances", stock: 15, status: "active" as const },
  { name: "Air Fryer", description: "Digital air fryer with 6 quart capacity", price: 99.99, category: "Appliances", stock: 35, status: "active" as const },
  { name: "Notebook Set", description: "Set of 5 spiral notebooks", price: 14.99, category: "Stationery", stock: 200, status: "active" as const },
  { name: "Pen Pack", description: "Pack of 12 ballpoint pens", price: 9.99, category: "Stationery", stock: 300, status: "active" as const },
  { name: "Highlighter Set", description: "Set of 6 colored highlighters", price: 12.99, category: "Stationery", stock: 180, status: "active" as const },
  { name: "Smartphone X", description: "Latest model smartphone with 5G", price: 899.99, category: "Electronics", stock: 40, status: "active" as const },
  { name: "Tablet Pro", description: "10-inch tablet with stylus support", price: 549.99, category: "Electronics", stock: 28, status: "active" as const },
  { name: "USB Hub", description: "7-port USB 3.0 hub", price: 34.99, category: "Electronics", stock: 90, status: "active" as const },
  { name: "Bookshelf", description: "5-tier wooden bookshelf", price: 179.99, category: "Furniture", stock: 18, status: "active" as const },
  { name: "File Cabinet", description: "3-drawer metal file cabinet", price: 149.99, category: "Furniture", stock: 25, status: "active" as const },
  { name: "Monitor Stand", description: "Adjustable monitor stand with storage", price: 39.99, category: "Electronics", stock: 55, status: "active" as const },
  { name: "Webcam HD", description: "1080p HD webcam with microphone", price: 69.99, category: "Electronics", stock: 70, status: "active" as const },
  { name: "Headphones", description: "Noise-canceling over-ear headphones", price: 199.99, category: "Electronics", stock: 38, status: "active" as const },
  { name: "Blender", description: "High-speed blender with multiple settings", price: 79.99, category: "Appliances", stock: 22, status: "active" as const },
  { name: "Toaster", description: "4-slice toaster with bagel function", price: 49.99, category: "Appliances", stock: 30, status: "inactive" as const },
  { name: "Electric Kettle", description: "1.7L electric kettle with temperature control", price: 39.99, category: "Appliances", stock: 0, status: "inactive" as const },
  { name: "Paper Clips", description: "Box of 100 paper clips", price: 3.99, category: "Stationery", stock: 500, status: "active" as const },
  { name: "Stapler", description: "Heavy-duty stapler", price: 15.99, category: "Stationery", stock: 85, status: "active" as const },
  { name: "Calculator", description: "Scientific calculator", price: 24.99, category: "Electronics", stock: 0, status: "discontinued" as const },
  { name: "Printer", description: "Wireless all-in-one printer", price: 149.99, category: "Electronics", stock: 0, status: "discontinued" as const },
  { name: "Scanner", description: "Document scanner with OCR", price: 199.99, category: "Electronics", stock: 0, status: "discontinued" as const },
  { name: "Cork Board", description: "Cork bulletin board 24x36 inches", price: 29.99, category: "Furniture", stock: 40, status: "active" as const },
  { name: "Whiteboard", description: "Magnetic whiteboard 48x36 inches", price: 89.99, category: "Furniture", stock: 15, status: "active" as const },
];

export const seedDatabase = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").take(1);
    if (existingProducts.length > 0) {
      console.log("Database already seeded");
      return null;
    }

    for (const product of sampleProducts) {
      await ctx.db.insert("products", product);
    }

    console.log(`Seeded ${sampleProducts.length} products`);
    return null;
  },
});

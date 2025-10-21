# Convex Paginated Data Table

A modern Next.js application demonstrating **cursor-based Convex pagination** integrated with **TanStack Table**. This project showcases real-time data synchronization, proper server-side pagination patterns, and a clean, responsive UI for managing product inventory.

> **📘 Want to implement this in your project?** See [PAGINATION_GUIDE.md](./PAGINATION_GUIDE.md) for step-by-step instructions.

## Features

- **Real-time Data Sync**: Powered by Convex's reactive database
- **Cursor-based Pagination**: Efficient prev/next navigation with Convex cursors
- **URL State Management**: All filters and pagination state synced to URL (shareable links!)
- **Backend Filtering**: Server-side filtering by category and status (with combined filter support)
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components
- **Type-safe**: Full TypeScript support with Convex's generated types
- **Loading Skeletons**: Professional loading states with animated skeletons

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (serverless backend platform)
- **UI Components**: shadcn/ui, Tailwind CSS, TanStack Table
- **State Management**: nuqs (URL query state)
- **Pagination**: Custom hook (`useSimplePaginatedQuery`) for cursor-based navigation
- **Icons**: Lucide React

## Project Structure

```
.
├── app/
│   ├── globals.css                    # Global styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Main entry point
├── components/
│   ├── products/
│   │   ├── columns.tsx                # TanStack Table column definitions
│   │   ├── data-table.tsx             # Main table component
│   │   ├── data-table-pagination.tsx  # Custom pagination controls
│   │   ├── data-table-skeleton.tsx    # Loading skeleton UI
│   │   ├── data-table-toolbar.tsx     # Filter controls
│   │   └── data-table-faceted-filter.tsx
│   ├── products-page.tsx              # Products page with pagination logic
│   └── ui/                            # shadcn/ui components
├── convex/
│   ├── products.ts                    # Paginated queries and mutations
│   ├── schema.ts                      # Database schema
│   └── seed.ts                        # Database seeding
├── hooks/
│   └── useSimplePaginatedQuery.ts     # ⭐ Custom pagination hook
├── lib/
│   └── utils.ts                       # Utilities
├── PAGINATION_GUIDE.md                # 📘 Implementation guide
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Convex account (sign up at [convex.dev](https://convex.dev))

### Installation

1. Clone the repository and navigate to the project directory

2. Install dependencies:
```bash
npm install
```

3. Set up Convex:
```bash
npx convex dev
```
This will prompt you to log in to Convex and create a new project or link to an existing one.

4. In a new terminal, run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Seeding the Database

To populate the database with sample data, run the seed function from the Convex dashboard:

```bash
npx convex dashboard
```

Then navigate to Functions → `seed:seedProducts` → Run.

## Usage

Once the application is running:

1. **View Products**: The main page displays a paginated list of products
2. **Filter by Category**: Use the category filter to show specific product categories
3. **Filter by Status**: Filter by active, inactive, or discontinued products
4. **Combine Filters**: Apply both category and status filters simultaneously
5. **Navigate Pages**: Use prev/next buttons for cursor-based pagination
6. **Change Page Size**: Select 10, 20, 30, 40, or 50 items per page
7. **Search**: Client-side search filters the current page
8. **Share Links**: All filters and pagination state are in the URL for easy sharing
9. **Real-time Updates**: Any data changes automatically reflect in the UI

## Key Features Demonstrated

### Custom Cursor-based Pagination Hook

The application uses a custom `useSimplePaginatedQuery` hook that wraps Convex's pagination:

```typescript
const paginationState = useSimplePaginatedQuery(
  api.products.list,
  { category, status },
  {
    initialNumItems: pageSize,
    onPageChange: (newPage) => setPageNum(newPage),
    onPageSizeChange: (newSize) => setPageSize(newSize)
  }
);
```

**Benefits:**
- Manages cursor state for prev/next navigation
- Auto-resets pagination when filters change
- Integrates seamlessly with URL state management

### Server-side Filtering with Indexes

Filters are applied on the server using Convex indexes for optimal performance:

```typescript
// Use index for single filter
return await ctx.db
  .query("products")
  .withIndex("by_status", (q) => q.eq("status", args.status))
  .paginate(args.paginationOpts);

// Combined filters: use index + client-side filter
const results = await ctx.db
  .query("products")
  .withIndex("by_status", (q) => q.eq("status", args.status))
  .paginate(args.paginationOpts);

return {
  ...results,
  page: results.page.filter(p => p.category === args.category)
};
```

### TanStack Table Integration

TanStack Table is used **only for display** - all pagination logic is handled by the custom hook:

```typescript
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  // ❌ NO getPaginationRowModel() - pagination handled by Convex
});
```

### Type Safety

Full TypeScript support with generated types from Convex schema ensures type safety across the entire application.

## Development

### Scripts

- `npm run dev` - Start both frontend and backend in parallel
- `npm run dev:frontend` - Start Next.js dev server only
- `npm run dev:backend` - Start Convex dev server only
- `npx convex dashboard` - Open the Convex dashboard to manage data

### Key Files for Customization

- **Pagination Logic**: `hooks/useSimplePaginatedQuery.ts`
- **Table Configuration**: `components/products/data-table.tsx`
- **Backend Queries**: `convex/products.ts`
- **Filter UI**: `components/products/data-table-toolbar.tsx`

## Implementation Guide

Want to add this pagination pattern to your own Convex + TanStack Table project?

**👉 See [PAGINATION_GUIDE.md](./PAGINATION_GUIDE.md) for complete implementation instructions.**

## Contributing

Feel free to submit issues and enhancement requests!

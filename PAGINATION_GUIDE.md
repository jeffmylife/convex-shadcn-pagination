# Convex + TanStack Table Pagination Guide

Quick guide to implement cursor-based Convex pagination with TanStack Table.

## Core Principle
**Don't use TanStack Table's pagination.** Let Convex handle pagination via a custom hook, use TanStack Table only for display.

## Implementation Steps

### 1. Copy the Pagination Hook
Copy `hooks/useSimplePaginatedQuery.ts` to your project.

**What it does:**
- Manages Convex cursor state (prev/next navigation)
- Auto-resets when filters/args change
- Provides `loadNext()`, `loadPrev()`, `setPageSize()`

### 2. Set Up Your Convex Query
```typescript
// convex/yourTable.ts
export const list = query({
  args: {
    paginationOpts: paginationOptsValidator,
    // Add your filters here
    filter1: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("yourTable")
      .withIndex("by_filter1", (q) => q.eq("filter1", args.filter1))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

**Key points:**
- Use separate query chains per filter combo (avoid reassigning query variable)
- Use indexes where possible
- Return early for each case

### 3. Use the Hook in Your Component
```typescript
import { useSimplePaginatedQuery } from "@/hooks/useSimplePaginatedQuery"
import { useQueryState, parseAsInteger, parseAsString } from "nuqs"

function YourComponent() {
  // URL state for filters and pagination
  const [filter1, setFilter1] = useQueryState("filter1", parseAsString.withDefault(""))
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10))
  const [pageNum, setPageNum] = useQueryState("page", parseAsInteger.withDefault(1))

  const paginationState = useSimplePaginatedQuery(
    api.yourTable.list,
    { filter1: filter1 || undefined },
    {
      initialNumItems: pageSize,
      pageSize: pageSize,
      onPageChange: (newPage) => setPageNum(newPage),
      onPageSizeChange: (newSize) => {
        setPageSize(newSize)
        setPageNum(1)
      }
    }
  )

  const data = paginationState.status === "loaded"
    ? paginationState.currentResults.page
    : []

  const isLoading = paginationState.status !== "loaded"
}
```

### 4. Configure TanStack Table (NO Pagination)
```typescript
const table = useReactTable({
  data,
  columns,
  state: {
    sorting,
    columnVisibility,
    rowSelection,
    columnFilters,
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  // ❌ NO getPaginationRowModel()
  // ❌ NO manualPagination
})
```

**Remove these:**
- `getPaginationRowModel()`
- `getFacetedRowModel()` (if using backend filters)
- `getFacetedUniqueValues()` (if using backend filters)
- `manualPagination` option

### 5. Create Custom Pagination Controls
Copy `components/products/data-table-pagination.tsx` or create:

```typescript
function Pagination({ paginationState }) {
  return (
    <div>
      <button
        onClick={paginationState.loadPrev}
        disabled={!paginationState.loadPrev}
      >
        Previous
      </button>
      <span>Page {paginationState.currentPageNum}</span>
      <button
        onClick={paginationState.loadNext}
        disabled={!paginationState.loadNext}
      >
        Next
      </button>
      <select
        value={paginationState.pageSize}
        onChange={(e) => paginationState.setPageSize(Number(e.target.value))}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  )
}
```

### 6. Handle Filters (Backend, not Table)
**Don't use TanStack Table's column filters for backend data.**

```typescript
// ✅ Good - Backend filtering
const handleFilterChange = (newFilter: string) => {
  setFilter1(newFilter)
  setPageNum(1) // Reset to page 1
}

// ❌ Bad - Table column filtering (client-side only)
table.getColumn("name")?.setFilterValue(value)
```

Pass filters directly to your Convex query via the hook's `args`.

### 7. Optional: Loading Skeleton
Copy `components/products/data-table-skeleton.tsx` for better UX:

```typescript
<TableBody>
  {isLoading ? (
    <DataTableSkeleton columns={columns.length} />
  ) : (
    // ... render rows
  )}
</TableBody>
```

## File Reference
Files to copy from this project:
- `hooks/useSimplePaginatedQuery.ts` - Core pagination hook
- `components/products/data-table-pagination.tsx` - Pagination controls
- `components/products/data-table-skeleton.tsx` - Loading state (optional)

## Common Pitfalls

### ❌ Don't do this:
```typescript
// Trying to use TanStack Table pagination
getCoreRowModel: getCoreRowModel(),
getPaginationRowModel: getPaginationRowModel(), // ❌
manualPagination: true, // ❌
```

### ❌ Don't do this:
```typescript
// Reassigning query in Convex
let query = ctx.db.query("table")
if (filter) {
  query = query.withIndex(...) // ❌ Type error
}
```

### ❌ Don't do this:
```typescript
// Using table column filters for backend data
table.getColumn("status")?.setFilterValue(value) // ❌ Client-side only
```

### ✅ Do this:
```typescript
// Early returns with separate query chains
if (statusFilter) {
  return await ctx.db
    .query("products")
    .withIndex("by_status", (q) => q.eq("status", statusFilter))
    .paginate(args.paginationOpts)
}
return await ctx.db.query("products").paginate(args.paginationOpts)
```

## Summary
1. **Hook manages pagination** - Copy `useSimplePaginatedQuery.ts`
2. **Convex handles data** - Write paginated queries with indexes
3. **Table displays only** - Remove all pagination features from table
4. **Filters go to backend** - Pass filters as query args, not table columns
5. **Custom controls** - Build prev/next buttons using hook's state

**Result:** Clean separation between backend cursor pagination and frontend table display.

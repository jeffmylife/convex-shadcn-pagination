"use client"

import { api } from "@/convex/_generated/api"
import { columns } from "./products/columns"
import { ProductsDataTable } from "./products/data-table"
import { parseAsInteger, parseAsString, useQueryState } from "nuqs"
import { useCallback, Suspense, useMemo, useEffect } from "react"
import { useSimplePaginatedQuery } from "@/hooks/useSimplePaginatedQuery"

function ProductsContent() {
  const [category, setCategory] = useQueryState("category", parseAsString.withDefault(""))
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault(""))
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  // Note: pageNum tracks current page for URL sharing, but cursor-based pagination
  // doesn't support direct navigation to arbitrary pages (would need to load all previous pages)
  const [pageNum, setPageNum] = useQueryState("page", parseAsInteger.withDefault(1))
  const [pageSize, setPageSize] = useQueryState("pageSize", parseAsInteger.withDefault(10))

  const categoryFilter = category && category !== "" ? category : undefined
  const statusFilter = status && status !== "" ?
    status as "active" | "inactive" | "discontinued" :
    undefined

  const paginationState = useSimplePaginatedQuery(
    api.products.list,
    {
      category: categoryFilter,
      status: statusFilter
    },
    {
      initialNumItems: pageSize,
      pageSize: pageSize,
      onPageChange: (newPage) => setPageNum(newPage),
      onPageSizeChange: (newSize) => {
        setPageSize(newSize)
        setPageNum(1) // Reset to page 1 when page size changes
      }
    }
  )

  // Sync URL page number with actual page if they diverge (e.g., from direct link)
  useEffect(() => {
    if (paginationState.currentPageNum !== pageNum) {
      setPageNum(paginationState.currentPageNum)
    }
  }, [paginationState.currentPageNum, pageNum, setPageNum])

  const isLoading = paginationState.status === "loading" ||
                    paginationState.status === "loadingNext" ||
                    paginationState.status === "loadingPrev"

  const currentData = paginationState.status === "loaded"
    ? paginationState.currentResults.page
    : []

  const handleFilterChange = useCallback((filters: {
    category?: string
    status?: string
    search?: string
  }) => {
    Promise.resolve().then(() => {
      if (filters.hasOwnProperty('category')) {
        setCategory(filters.category || "")
        setPageNum(1) // Reset to page 1 when filters change
      }
      if (filters.hasOwnProperty('status')) {
        setStatus(filters.status || "")
        setPageNum(1) // Reset to page 1 when filters change
      }
      if (filters.hasOwnProperty('search')) {
        setSearch(filters.search || "")
      }
    })
  }, [setCategory, setStatus, setSearch, setPageNum])

  // Client-side search filtering on current page only
  const filteredData = useMemo(() => {
    if (!search || search === "") return currentData
    const searchLower = search.toLowerCase()
    return currentData.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description.toLowerCase().includes(searchLower)
    )
  }, [currentData, search])

  return (
    <ProductsDataTable
      columns={columns}
      data={filteredData}
      isLoading={isLoading}
      paginationState={paginationState}
      onFilterChange={handleFilterChange}
      currentFilters={{
        category: category || undefined,
        status: status || undefined,
        search: search || undefined,
      }}
    />
  )
}

export function ProductsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Product Inventory</h1>
        <p className="text-muted-foreground">
          Manage your products and inventory levels
        </p>
      </div>
      <Suspense fallback={
        <div className="flex items-center justify-center h-96">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }>
        <ProductsContent />
      </Suspense>
    </div>
  )
}

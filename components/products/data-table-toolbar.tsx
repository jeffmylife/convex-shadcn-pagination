"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onFilterChange?: (filters: {
    category?: string
    status?: string
    search?: string
  }) => void
  currentFilters?: {
    category?: string
    status?: string
    search?: string
  }
}

const statuses = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
  {
    value: "discontinued",
    label: "Discontinued",
  },
]

const categories = [
  {
    value: "Electronics",
    label: "Electronics",
  },
  {
    value: "Furniture",
    label: "Furniture",
  },
  {
    value: "Appliances",
    label: "Appliances",
  },
  {
    value: "Stationery",
    label: "Stationery",
  },
]

export function DataTableToolbar<TData>({
  table,
  onFilterChange = () => {},
  currentFilters = {},
}: DataTableToolbarProps<TData>) {
  const isFiltered = !!(currentFilters.category || currentFilters.status || currentFilters.search)

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter products..."
          value={currentFilters.search ?? ""}
          onChange={(event) => {
            onFilterChange({ search: event.target.value })
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <DataTableFacetedFilter
          title="Status"
          options={statuses}
          selectedValue={currentFilters.status}
          onFilterChange={(values) => {
            onFilterChange({ status: values.length > 0 ? values[0] : "" })
          }}
        />
        <DataTableFacetedFilter
          title="Category"
          options={categories}
          selectedValue={currentFilters.category}
          onFilterChange={(values) => {
            onFilterChange({ category: values.length > 0 ? values[0] : "" })
          }}
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              onFilterChange({ category: "", status: "", search: "" })
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}

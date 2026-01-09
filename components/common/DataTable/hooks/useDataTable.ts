'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  PaginationState,
} from '@tanstack/react-table'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

interface UseDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
}

export function useDataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  pageCount,
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // --- URL Initial States ---
  const initialPageIndex = Number(searchParams.get('page') || '1') - 1
  const initialPageSize = Number(searchParams.get('limit') || '100')
  const initialGlobalFilter = searchParams.get('search') || ''

  const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    searchParams.forEach((value, key) => {
      if (!['page', 'limit', 'search'].includes(key)) {
        filters.push({ id: key, value })
      }
    })
    return filters
  }, [searchParams])

  // --- React Table States ---
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter)
  const [rowSelection, setRowSelection] = useState({})
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  })

  // --- URL Sync (500ms Debounce) ---
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()

      if (pagination.pageIndex > 0)
        params.set('page', (pagination.pageIndex + 1).toString())
      if (pagination.pageSize !== 100)
        params.set('limit', pagination.pageSize.toString())
      if (globalFilter) params.set('search', globalFilter)

      columnFilters.forEach((filter) => {
        if (filter.value) params.set(filter.id, filter.value as string)
      })

      const queryString = params.toString()
      if (queryString !== searchParams.toString()) {
        router.replace(`${pathname}?${queryString}`, { scroll: false })
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [pagination, columnFilters, globalFilter, router, pathname, searchParams])

  const table = useReactTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    getRowId: (row) => row.id.toString(),
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const [collapsedColumns, setCollapsedColumns] = useState<
    Record<string, boolean>
  >({})

  const toggleColumn = (columnId: string) => {
    setCollapsedColumns((prev) => {
      const newState = { ...prev }

      if (newState[columnId]) {
        delete newState[columnId]
      } else {
        newState[columnId] = true
      }

      const allToggleableColumns = table
        .getAllLeafColumns()
        .filter((col) => col.id !== 'select')

      const collapsedCount = allToggleableColumns.filter(
        (col) => newState[col.id],
      ).length

      if (collapsedCount === allToggleableColumns.length) {
        return {}
      }

      return newState
    })
  }

  return {
    table,
    globalFilter,
    columnFilters,
    collapsedColumns,
    setGlobalFilter,
    toggleColumn,
  }
}

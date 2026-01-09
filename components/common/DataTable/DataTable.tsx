// components/common/DataTable/DataTable.tsx
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  LuArrowUpDown,
  LuSearch,
  LuChevronsRight,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronLeft,
  LuFilter,
} from 'react-icons/lu'
import { useRouter } from 'next/navigation'
import { usePathname, useSearchParams } from 'next/navigation'

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  estimateRowHeight?: number
  className?: string
  pageCount: number
  rowCount: number
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  pageCount,
  rowCount,
  estimateRowHeight = 50,
  className = 'h-full',
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialPageIndex = Number(searchParams.get('page') || '1') - 1
  const initialPageSize = Number(searchParams.get('limit') || '100')
  const initialGlobalFilter = searchParams.get('search') || ''

  const initialColumnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = []
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'limit' && key !== 'search') {
        filters.push({ id: key, value })
      }
    })
    return filters
  }, [searchParams])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)
  const [globalFilter, setGlobalFilter] = useState(initialGlobalFilter)
  const [rowSelection, setRowSelection] = useState({}) // Para Checkboxes
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialPageIndex,
    pageSize: initialPageSize,
  })

  useEffect(() => {
    // Criamos um atraso (timeout) de 500ms
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()

      // 1. Paginação e Limit
      if (pagination.pageIndex > 0)
        params.set('page', (pagination.pageIndex + 1).toString())
      if (pagination.pageSize !== 100)
        params.set('limit', pagination.pageSize.toString())

      // 2. Filtro Global
      if (globalFilter) params.set('search', globalFilter)

      // 3. Filtros por Coluna
      columnFilters.forEach((filter) => {
        if (filter.value) {
          params.set(filter.id, filter.value as string)
        }
      })

      // Verifica se a URL realmente mudou antes de dar replace (Otimização Extra)
      const queryString = params.toString()
      const currentQuery = searchParams.toString()

      if (queryString !== currentQuery) {
        router.replace(`${pathname}?${queryString}`, { scroll: false })
      }
    }, 500) // <--- Espera 500ms após a última mudança

    // Função de limpeza: Se o usuário digitar de novo antes dos 500ms,
    // cancela o agendamento anterior e começa a contar do zero.
    return () => clearTimeout(timeout)
  }, [pagination, columnFilters, globalFilter, router, pathname, searchParams])

  const table = useReactTable({
    data,
    columns,
    getRowId: (row) => row.id.toString(),

    // MODO SERVIDOR ATIVADO:
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true, // Se quiser ordenar no back também (recomendado)

    pageCount: pageCount, // Avisa quantas páginas existem no total
    rowCount: rowCount, // Avisa quantos itens existem no total

    autoResetPageIndex: false,

    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination,
    },
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    enableRowSelection: true,
  })

  const { rows } = table.getRowModel() // rows da página atual
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 5,
  })

  // --- REQUISITO 1.3: Lógica dos botões de paginação (Max 5) ---
  const getPageNumbers = () => {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1
    const maxButtons = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    let endPage = startPage + maxButtons - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    )
  }

  return (
    <div className='flex flex-col gap-4 w-full h-full'>
      {/* 1. FILTRO GLOBAL (Mantido igual) */}
      <div className='flex justify-between items-center shrink-0'>
        <div className='relative max-w-sm w-full'>
          <LuSearch className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Pesquisar em tudo...'
            className='pl-8 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {/* Mostra quantos selecionados (Requisito 0) */}
        {Object.keys(rowSelection).length > 0 && (
          <div className='text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-md'>
            {Object.keys(rowSelection).length} selecionado(s)
          </div>
        )}
      </div>

      {/* 2. CONTAINER DA TABELA */}
      <div
        ref={tableContainerRef}
        className={`relative overflow-auto border rounded-t-md bg-white w-full ${className}`}
      >
        <table className='min-w-full w-fit grid'>
          <thead className='bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm grid w-full'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='flex w-full border-b'>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className='p-4 font-semibold text-left flex items-start'
                      style={{
                        minWidth: header.getSize(),
                        flex: 1,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex flex-col gap-2 w-full'>
                          <div
                            className={`flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 ${
                              header.column.getCanSort() ? '' : 'cursor-default'
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() && (
                              <LuArrowUpDown className='h-3 w-3 flex-shrink-0' />
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>

                          {header.column.getCanFilter() ? (
                            <input
                              type='text'
                              value={
                                (header.column.getFilterValue() as string) ?? ''
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder='Filtrar...'
                              className='w-full text-xs font-normal border rounded px-2 py-1 focus:outline-blue-500'
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>

          <tbody
            className='relative grid w-full'
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className={`absolute top-0 left-0 w-full flex items-center border-b hover:bg-gray-50 transition-colors ${
                    row.getIsSelected() ? 'bg-blue-50 hover:bg-blue-100' : ''
                  }`} // Highlight visual da seleção
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-4 py-2 flex items-center'
                      style={{
                        minWidth: cell.column.getSize(),
                        flex: 1,
                      }}
                    >
                      <div className='truncate w-full'>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr className='absolute w-full p-4 flex justify-center text-gray-500'>
                <td>Nenhum resultado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 3. RODAPÉ E PAGINAÇÃO (Novo Bloco) */}
      <div className='border border-t-0 rounded-b-md bg-gray-50 p-4 flex flex-col gap-4'>
        {/* REQUISITO 4.1 & 5: Filtros Aplicados e Total */}
        <div className='flex justify-between items-center text-sm text-gray-600 border-b pb-4'>
          <div className='flex gap-2 items-center flex-wrap'>
            <span className='font-semibold flex items-center gap-1'>
              <LuFilter size={14} /> Applied Filters:
            </span>
            {columnFilters.length === 0 && (
              <span className='text-gray-400 italic'>None</span>
            )}
            {columnFilters.map((filter) => (
              <span
                key={filter.id}
                className='bg-white border px-2 py-1 rounded text-xs font-medium'
              >
                {filter.id}:{' '}
                <span className='text-blue-600'>{filter.value as string}</span>
              </span>
            ))}
          </div>
          <div className='font-medium'>
            Total Rows:{' '}
            <span className='text-black'>
              {table.getFilteredRowModel().rows.length}
            </span>
          </div>
        </div>

        {/* CONTROLES DE PAGINAÇÃO */}
        <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
          {/* REQUISITO 2: Limit (100 - 10000) */}
          <div className='flex items-center gap-2'>
            <span className='text-sm text-gray-600'>Rows per page:</span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className='border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-blue-500'
            >
              {[100, 200, 500, 1000, 10000].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>

          {/* REQUISITO 1: Botões de Paginação */}
          <div className='flex items-center gap-1'>
            {/* 1.2 First Page */}
            <button
              className='p-2 rounded hover:bg-gray-200 disabled:opacity-30'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              title='First Page'
            >
              <LuChevronsLeft size={16} />
            </button>

            {/* 1.1 Previous Page */}
            <button
              className='p-2 rounded hover:bg-gray-200 disabled:opacity-30'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              title='Previous Page'
            >
              <LuChevronLeft size={16} />
            </button>

            {/* 1.3 Max 5 Numbered Buttons */}
            <div className='flex items-center gap-1 px-2'>
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => table.setPageIndex(pageNumber - 1)}
                  className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                    pageNumber === table.getState().pagination.pageIndex + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
            </div>

            {/* 1.5 Next Page */}
            <button
              className='p-2 rounded hover:bg-gray-200 disabled:opacity-30'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              title='Next Page'
            >
              <LuChevronRight size={16} />
            </button>

            {/* 1.4 Last Page */}
            <button
              className='p-2 rounded hover:bg-gray-200 disabled:opacity-30'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              title='Last Page'
            >
              <LuChevronsRight size={16} />
            </button>
          </div>

          <span className='text-sm text-gray-500'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
        </div>
      </div>
    </div>
  )
}

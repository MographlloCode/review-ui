// components/common/DataTable/DataTable.tsx
'use client'

import React, { useRef, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { LuArrowUpDown, LuSearch } from 'react-icons/lu'

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  estimateRowHeight?: number
  className?: string
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  estimateRowHeight = 50,
  className = 'h-full',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, globalFilter },
    getRowId: (row) => row.id.toString(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  })

  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 5,
  })

  return (
    <div className='flex flex-col gap-4 w-full h-full'>
      {/* 1. FILTRO GLOBAL (Mantido igual) */}
      <div className='relative max-w-sm flex-shrink-0'>
        <LuSearch className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Pesquisar em tudo...'
          className='pl-8 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* 2. CONTAINER DA TABELA */}
      <div
        ref={tableContainerRef}
        className={`relative overflow-auto border rounded-md bg-white w-full ${className}`}
      >
        {/* Usamos w-full e grid para forçar comportamento de bloco */}
        <table className='min-w-full w-fit grid'>
          {/* HEADER */}
          <thead className='bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm grid w-full'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='flex w-full border-b'>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className='p-4 font-semibold text-left flex items-start' // flex items-start garante alinhamento
                      style={{
                        minWidth: header.getSize(),
                        flex: 1,
                      }} // Largura fixa vinda da definição
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex flex-col gap-2 w-full'>
                          {/* Cabeçalho Clicável */}
                          <div
                            className={`flex items-center gap-2 cursor-pointer select-none text-sm hover:text-blue-600 ${
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

                          {/* Filtro */}
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

          {/* BODY VIRTUALIZADO */}
          <tbody
            className='relative grid w-full'
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  id={row.id}
                  data-row-id={row.original.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  // O segredo é usar 'flex' aqui também para imitar o header
                  className='absolute top-0 left-0 w-full flex items-center border-b hover:bg-gray-50 transition-colors'
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-4 py-2 flex items-center' // Flex para centralizar verticalmente o conteúdo
                      style={{
                        minWidth: cell.column.getSize(),
                        flex: 1,
                      }} // Mesma largura do Header
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
    </div>
  )
}

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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  estimateRowHeight?: number
  className?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  estimateRowHeight = 50, // Altura um pouco maior para acomodar botões
  className = 'h-full',
}: DataTableProps<TData, TValue>) {
  // --- ESTADOS DA TABELA ---
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    // Pipelines de processamento
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Necessário para filtros funcionarem
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  })

  // --- VIRTUALIZAÇÃO ---
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Importante: Pegamos as linhas DO MODELO (que já estão filtradas e ordenadas)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateRowHeight,
    overscan: 5,
  })

  return (
    <div className='flex flex-col gap-4 w-full max-h-full'>
      {/* 1. FILTRO GLOBAL */}
      <div className='relative max-w-sm'>
        <LuSearch className='absolute left-2 top-2.5 h-4 w-4 text-gray-500' />
        <input
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Pesquisar em tudo...'
          className='pl-8 h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
      </div>

      {/* 2. CONTAINER DA TABELA (SCROLL) */}
      <div
        ref={tableContainerRef}
        className={`relative overflow-auto border rounded-md bg-white ${className} h-full w-full`}
      >
        <table className='w-full text-sm text-left'>
          <thead className='bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className='p-4 font-semibold align-top border-b'
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex flex-col gap-2'>
                          {/* Cabeçalho Clicável para Ordenação */}
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
                              <LuArrowUpDown className='h-3 w-3' />
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>

                          {/* 3. FILTRO POR COLUNA */}
                          {header.column.getCanFilter() ? (
                            <input
                              type='text'
                              value={
                                (header.column.getFilterValue() as string) ?? ''
                              }
                              onChange={(e) =>
                                header.column.setFilterValue(e.target.value)
                              }
                              placeholder={`Filtrar...`}
                              className='w-full text-xs font-normal border rounded px-2 py-1 focus:outline-blue-500'
                              // Importante: Impede que o clique no input dispare a ordenação
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
            className='relative'
            style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr
                  key={row.id}
                  data-index={virtualRow.index}
                  ref={rowVirtualizer.measureElement}
                  className='absolute top-0 left-0 w-full flex items-center border-b hover:bg-gray-50 transition-colors'
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className='px-4 py-2 flex items-center truncate'
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              )
            })}

            {rows.length === 0 && (
              <tr className='absolute w-full p-4 text-center text-gray-500'>
                <td>Nenhum resultado encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

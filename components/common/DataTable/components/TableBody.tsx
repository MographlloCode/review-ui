'use client'

import { useRef } from 'react'
import { flexRender, Table } from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { getColumnStyles } from '../utils'

interface TableBodyProps<TData> {
  table: Table<TData>
  estimateRowHeight?: number
  collapsedColumns: Record<string, boolean>
}

export function TableBody<TData extends { id: string | number }>({
  table,
  estimateRowHeight = 50,
  collapsedColumns,
}: TableBodyProps<TData>) {
  const tableContainerRef = useRef<HTMLTableSectionElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () =>
      tableContainerRef.current?.parentElement as HTMLElement,
    estimateSize: () => estimateRowHeight,
    overscan: 10,
  })

  return (
    <tbody
      ref={tableContainerRef}
      className='relative grid w-full'
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index]
        return (
          <tr
            key={row.id}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            className={`absolute top-0 left-0 w-full flex items-center border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300 ${
              row.getIsSelected() ? 'bg-blue-50 hover:bg-blue-100' : ''
            }`}
            style={{
              height: `${virtualRow.size}px`,
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {row.getVisibleCells().map((cell) => {
              const isCollapsed = collapsedColumns[cell.column.id]

              return (
                <td
                  key={cell.id}
                  style={getColumnStyles(
                    cell.column.id,
                    cell.column.getSize(),
                    isCollapsed,
                  )}
                  className={`px-4 py-2 flex items-center transition-all duration-300 h-full border-r border-gray-100 ${
                    isCollapsed ? 'bg-gray-50/30 justify-center' : ''
                  }`}
                >
                  {!isCollapsed ? (
                    <div className='truncate w-full text-sm text-gray-700'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </div>
                  ) : (
                    <div className='w-px h-full bg-gray-200' />
                  )}
                </td>
              )
            })}
          </tr>
        )
      })}

      {rows.length === 0 && (
        <tr className='absolute w-full p-8 flex justify-center items-center text-gray-500'>
          <td className='text-center'>
            No result found for the applied filters.
          </td>
        </tr>
      )}
    </tbody>
  )
}

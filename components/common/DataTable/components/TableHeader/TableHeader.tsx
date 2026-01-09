'use client'

import { flexRender, Table } from '@tanstack/react-table'
import { TableHeaderActions } from './TableHeaderActions'
import { getColumnStyles } from '../../utils'

interface TableHeaderProps<TData> {
  table: Table<TData>
  collapsedColumns: Record<string, boolean>
  toggleColumn: (id: string) => void
  showFilters: boolean
  toggleAllFilters: () => void
}

export function TableHeader<TData>({
  table,
  collapsedColumns,
  showFilters,
  toggleColumn,
  toggleAllFilters,
}: TableHeaderProps<TData>) {
  return (
    <thead className='bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm grid w-full'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className='flex w-full border-b border-gray-200'
        >
          {headerGroup.headers.map((header) => {
            const isCollapsed = collapsedColumns[header.column.id] || false

            return (
              <th
                key={header.id}
                className='p-4 font-semibold text-left flex items-start transition-all duration-300'
                style={getColumnStyles(
                  header.id,
                  header.getSize(),
                  isCollapsed,
                )}
              >
                {!header.isPlaceholder && (
                  <div className='w-full h-full'>
                    {header.column.id === 'select' ? (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    ) : (
                      <TableHeaderActions
                        header={header}
                        table={table}
                        isCollapsed={isCollapsed}
                        onToggle={toggleColumn}
                        showFilters={showFilters}
                        toggleAllFilters={toggleAllFilters}
                      />
                    )}
                  </div>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}

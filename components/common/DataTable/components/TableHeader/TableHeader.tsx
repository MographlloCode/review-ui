'use client'

import { flexRender, Table } from '@tanstack/react-table'
import { TableHeaderActions } from './TableHeaderActions'

interface TableHeaderProps<TData> {
  table: Table<TData>
}

export function TableHeader<TData>({ table }: TableHeaderProps<TData>) {
  const getColumnStyle = (columnId: string, size: number) => {
    if (columnId === 'select') return { width: size, flex: '0 0 auto' }
    return { minWidth: size, flex: 1 }
  }

  return (
    <thead className='bg-gray-100 text-gray-700 sticky top-0 z-10 shadow-sm grid w-full'>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr
          key={headerGroup.id}
          className='flex w-full border-b border-gray-200'
        >
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              className='p-4 font-semibold text-left flex items-start'
              style={getColumnStyle(header.id, header.getSize())}
            >
              {!header.isPlaceholder && (
                <div className='w-full'>
                  {header.column.id === 'select' ? (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  ) : (
                    <TableHeaderActions header={header} table={table} />
                  )}
                </div>
              )}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}

'use client'

import { Header, Table } from '@tanstack/react-table'
import { LuArrowUpDown } from 'react-icons/lu'

interface TableHeaderActionsProps<TData, TValue> {
  header: Header<TData, TValue>
  table: Table<TData>
}

export function TableHeaderActions<TData, TValue>({
  header,
}: TableHeaderActionsProps<TData, TValue>) {
  const column = header.column

  if (column.id === 'select') {
    return null
  }

  return (
    <div className='flex flex-col gap-2 w-full'>
      <div
        className={`flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 transition-colors ${
          column.getCanSort() ? '' : 'cursor-default'
        }`}
        onClick={column.getToggleSortingHandler()}
      >
        <span className='truncate'>
          {typeof column.columnDef.header === 'string'
            ? column.columnDef.header
            : null}
        </span>

        {column.getCanSort() && (
          <div className='flex items-center'>
            <LuArrowUpDown
              className={`h-3 w-3 shrink-0 ${
                column.getIsSorted() ? 'text-blue-600' : 'text-gray-400'
              }`}
            />
            <span className='text-[10px] ml-1'>
              {{ asc: '🔼', desc: '🔽' }[column.getIsSorted() as string] ??
                null}
            </span>
          </div>
        )}
      </div>

      {column.getCanFilter() ? (
        <div className='relative group'>
          <input
            type='text'
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(e) => column.setFilterValue(e.target.value)}
            placeholder='Filter...'
            className='w-full text-xs font-normal border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-300'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : (
        <div className='h-7' />
      )}
    </div>
  )
}

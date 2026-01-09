'use client'

import { Table } from '@tanstack/react-table'
import { LuSearch } from 'react-icons/lu'

interface TableContainerToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function TableContainerToolbar<TData>({
  table,
  globalFilter,
  setGlobalFilter,
}: TableContainerToolbarProps<TData>) {
  const selectedRowsCount = Object.keys(table.getState().rowSelection).length

  return (
    <div className='flex justify-between items-center shrink-0 gap-4'>
      <div className='flex items-center gap-4 max-w-96'>
        <div className='relative max-w-72 w-full'>
          <LuSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
          <input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder='Search all columns...'
            className='pl-9 pr-4 h-9 w-full rounded-md border border-gray-300 bg-white text-sm 
                      placeholder:text-gray-400 focus:outline-none focus:ring-2 
                      focus:ring-blue-500 focus:border-transparent transition-all shadow-sm'
          />
        </div>
        <div className='flex items-center gap-3'>
          {selectedRowsCount > 0 && (
            <div className='items-center animate-in fade-in slide-in-from-right-2'>
              <span className='text-sm text-blue-600 font-semibold bg-gray-50 px-3 py-1.5 rounded-full border border-blue-100 shadow-sm text-nowrap'>
                {selectedRowsCount} Selected
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

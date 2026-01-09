'use client'

import { Table } from '@tanstack/react-table'
import { LuSearch } from 'react-icons/lu'

interface TableContainerToolbarProps<TData> {
  table: Table<TData>
  globalFilter: string
  setGlobalFilter: (value: string) => void
}

export function TableContainerToolbar<TData>({
  globalFilter,
  setGlobalFilter,
}: TableContainerToolbarProps<TData>) {
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
      </div>
    </div>
  )
}

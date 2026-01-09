'use client'

import React from 'react'
import { Table } from '@tanstack/react-table'
import { LuFilter } from 'react-icons/lu'

interface TableFooterProps<TData> {
  table: Table<TData>
  rowCount: number
  children?: React.ReactNode
}

export function TableFooter<TData>({
  table,
  rowCount,
  children,
}: TableFooterProps<TData>) {
  const columnFilters = table.getState().columnFilters

  return (
    <div className='border border-t-0 rounded-b-md bg-gray-50 p-4 flex flex-col gap-4'>
      <div className='flex justify-between items-center text-sm text-gray-600 border-b pb-4'>
        <div className='flex gap-2 items-center flex-wrap'>
          <span className='font-semibold flex items-center gap-1 text-gray-700'>
            <LuFilter size={14} /> Applied Filters:
          </span>

          {columnFilters.length === 0 && (
            <span className='text-gray-400 italic'>None</span>
          )}

          {columnFilters.map((filter) => (
            <span
              key={filter.id}
              className='bg-white border border-gray-200 px-2 py-1 rounded text-xs font-medium shadow-sm flex items-center gap-1'
            >
              <span className='text-gray-500'>{filter.id}:</span>
              <span className='text-blue-600'>{filter.value as string}</span>
            </span>
          ))}
        </div>

        <div className='font-medium whitespace-nowrap'>
          Total Rows: <span className='text-black'>{rowCount}</span>
        </div>
      </div>

      <div className='w-full'>{children}</div>
    </div>
  )
}

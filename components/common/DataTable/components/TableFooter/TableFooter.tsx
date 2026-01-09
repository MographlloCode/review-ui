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
    <div className='flex flex-wrap items-center gap-4 text-sm w-full justify-between'>
      <div className='flex items-center gap-8'>
        <div className='flex gap-2 items-center flex-nowrap'>
          <span className='font-semibold flex items-center gap-1 text-gray-700 text-nowrap'>
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
        <div className='font-medium whitespace-nowrap text-gray-600'>
          Total Rows: <span>{rowCount}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

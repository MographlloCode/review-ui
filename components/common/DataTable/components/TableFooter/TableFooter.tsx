'use client'

import React from 'react'
import { Table } from '@tanstack/react-table'
import { LuCheckCheck, LuFilter } from 'react-icons/lu'
import { capitalizeFirstLetter } from '../../utils'

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
  const selectedRowsCount = Object.keys(table.getState().rowSelection).length

  return (
    <div className='flex items-center gap-4 text-xs w-full justify-between md:flex-nowrap flex-wrap'>
      <div className='flex items-center gap-4'>
        <div className='flex text-gray-700 items-center gap-1'>
          <LuCheckCheck size={14} />
          <span className='bg-gray-50 text-nowrap'>
            <span className='font-semibold'>Selected Rows:</span>{' '}
            {selectedRowsCount === 0 ? (
              <span className='text-gray-400 italic'>None</span>
            ) : (
              selectedRowsCount
            )}
          </span>
        </div>
        <div className='flex flex-wrap md:flex-nowrap max-w-96 gap-1'>
          <span className='font-semibold flex items-center gap-1 text-gray-700 text-nowrap'>
            <LuFilter size={14} /> Applied Filters:
          </span>
          {columnFilters.length === 0 && (
            <span className='text-gray-400 italic'>None</span>
          )}
          <div className='flex items-center gap-1'>
            {columnFilters.map((filter, index) => (
              <span
                key={filter.id}
                className=' text-xs font-medium flex items-center gap-1 text-gray-700'
              >
                {capitalizeFirstLetter(filter.id)}
                {index < columnFilters.length - 1 && (
                  <span className='text-gray-400'>/</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <div className='flex items-center font-medium whitespace-nowrap text-gray-600 gap-1'>
          <span className='font-semibold'>Total Rows:</span>
          <span>{rowCount}</span>
        </div>
      </div>
      {children}
    </div>
  )
}

'use client'

import { Table } from '@tanstack/react-table'
import {
  LuChevronLeft,
  LuChevronRight,
  LuChevronsLeft,
  LuChevronsRight,
} from 'react-icons/lu'

interface TableFooterActionsProps<TData> {
  table: Table<TData>
}

export function TableFooterActions<TData>({
  table,
}: TableFooterActionsProps<TData>) {
  const getPageNumbers = () => {
    const totalPages = table.getPageCount()
    const currentPage = table.getState().pagination.pageIndex + 1
    const maxButtons = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    let endPage = startPage + maxButtons - 1

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, endPage - maxButtons + 1)
    }

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, i) => startPage + i,
    )
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className='flex flex-col sm:flex-row justify-between items-center gap-4 w-full'>
      <div className='flex items-center gap-2'>
        <span className='text-sm text-gray-600'>Rows per page:</span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className='border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-blue-500 cursor-pointer hover:border-gray-400 transition-colors'
        >
          {[100, 200, 500, 1000, 10000].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className='flex items-center gap-1'>
        <button
          className='p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          title='First Page'
        >
          <LuChevronsLeft size={18} />
        </button>

        <button
          className='p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          title='Previous Page'
        >
          <LuChevronLeft size={18} />
        </button>

        <div className='flex items-center gap-1 px-2'>
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => table.setPageIndex(pageNumber - 1)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-all ${
                pageNumber === table.getState().pagination.pageIndex + 1
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 hover:bg-gray-100 text-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          className='p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          title='Next Page'
        >
          <LuChevronRight size={18} />
        </button>

        <button
          className='p-2 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors'
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          title='Last Page'
        >
          <LuChevronsRight size={18} />
        </button>
      </div>

      <div className='text-sm text-gray-500 font-medium min-w-25 text-right'>
        Page {table.getState().pagination.pageIndex + 1} of{' '}
        {table.getPageCount()}
      </div>
    </div>
  )
}

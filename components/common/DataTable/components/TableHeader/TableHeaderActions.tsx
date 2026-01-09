'use client'

import { Header, Table } from '@tanstack/react-table'
import { TableColumnFilterCombo } from './TableColumFilterCombo'
import {
  LuArrowUpDown,
  LuChevronLeft,
  LuChevronRight,
  LuFilter,
} from 'react-icons/lu'
import { Button } from '@/components/common/Button'
import { motion, AnimatePresence } from 'motion/react'

interface TableHeaderActionsProps<TData, TValue> {
  header: Header<TData, TValue>
  table: Table<TData>
  isCollapsed: boolean
  onToggle: (id: string) => void
  showFilters: boolean
  toggleAllFilters: () => void
}

export function TableHeaderActions<TData, TValue>({
  header,
  isCollapsed,
  onToggle,
  showFilters,
  toggleAllFilters,
}: TableHeaderActionsProps<TData, TValue>) {
  const column = header.column
  if (column.id === 'select') return null

  const headerTitle =
    typeof column.columnDef.header === 'string'
      ? column.columnDef.header
      : column.id

  return (
    <div
      className={`relative flex flex-col w-full transition-all duration-300 ${
        isCollapsed
          ? 'items-center h-full'
          : showFilters
          ? 'h-15 gap-2'
          : 'h-6 gap-1'
      }`}
    >
      {isCollapsed && (
        <div
          onClick={() => onToggle(column.id)}
          className={`absolute -left-1 -top-4 w-8 h-12 bg-gray-400 rounded-b-md shadow-lg flex items-center justify-center z-50 cursor-pointer hover:bg-blue-700 transition-all duration-300`}
        >
          <span className='text-[9px] text-white font-black rotate-90 whitespace-nowrap uppercase tracking-widest select-none'>
            {headerTitle.substring(0, 4)}
          </span>
        </div>
      )}

      <div
        className={`flex w-full items-center ${
          isCollapsed ? '' : 'justify-between'
        }`}
      >
        {!isCollapsed && (
          <div className='flex items-center gap-2'>
            <div
              className='flex items-center gap-2 cursor-pointer select-none hover:text-blue-600 truncate'
              onClick={column.getToggleSortingHandler()}
            >
              <span className='font-bold text-xs uppercase text-gray-500 truncate'>
                {headerTitle}
              </span>
              {column.getCanSort() && (
                <LuArrowUpDown size={12} className='w-6' />
              )}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                toggleAllFilters()
              }}
              data-filter={headerTitle}
              className='w-10'
            >
              <LuFilter size={12} />
            </Button>
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggle(column.id)
          }}
          className='p-1 rounded-md hover:bg-gray-200 text-gray-400 hover:text-gray-600'
        >
          {isCollapsed ? (
            <LuChevronRight size={14} />
          ) : (
            <LuChevronLeft size={14} />
          )}
        </button>
      </div>

      {!isCollapsed && showFilters && column.getCanFilter() && (
        <div className='relative animate-in fade-in duration-500'>
          {column.id === 'haveChangeRequest' ? (
            <TableColumnFilterCombo
              column={column}
              options={['CR Reviewed', 'Pending Review']}
            />
          ) : (
            <AnimatePresence>
              <motion.input
                type='text'
                value={(column.getFilterValue() as string) ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                placeholder='Filter...'
                className='w-full h-8 text-xs border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none font-normal bg-gray-50'
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              />
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  )
}

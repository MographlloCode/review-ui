// components/common/DataTable/components/TableHeader/TableColumnFilterCombo.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Column } from '@tanstack/react-table'
import { LuChevronDown, LuSearch } from 'react-icons/lu'

interface TableColumnFilterComboProps<TData, TValue> {
  column: Column<TData, TValue>
  options: string[]
}

export function TableColumnFilterCombo<TData, TValue>({
  column,
  options,
}: TableColumnFilterComboProps<TData, TValue>) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const currentValue = (column.getFilterValue() as string) ?? ''

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelect = (val: string) => {
    column.setFilterValue(val)
    setIsOpen(false)
    setSearchTerm('')
  }

  return (
    <div className='relative w-full font-normal' ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex text-xs justify-between items-center w-full h-8 border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none font-normal'
      >
        <span
          className={`
            ${currentValue ? 'text-gray-600 font-medium' : 'text-gray-400'}
          `}
        >
          {currentValue || 'Select...'}
        </span>
        <LuChevronDown
          className={`shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          size={12}
        />
      </button>

      {isOpen && (
        <div className='absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl z-20 min-w-40 animate-in fade-in zoom-in-95 duration-200'>
          <div className='p-2 border-b border-gray-200 flex items-center gap-2'>
            <LuSearch size={12} className='text-gray-400' />
            <input
              autoFocus
              className='w-full text-xs outline-none'
              placeholder='Search...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={() => handleSelect('')}
              className='text-left px-2 py-1.5 text-xs hover:bg-gray-100 rounded text-red-500'
            >
              Clear
            </button>
          </div>

          <div className='max-h-48 overflow-auto p-1'>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 rounded transition-colors ${
                    currentValue === opt
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700'
                  }`}
                >
                  {opt}
                </button>
              ))
            ) : (
              <div className='px-2 py-1.5 text-[10px] text-gray-400 italic text-center'>
                No results
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
